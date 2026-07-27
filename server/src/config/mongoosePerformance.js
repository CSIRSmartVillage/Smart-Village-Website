import mongoose from "mongoose";
import { AsyncLocalStorage } from "async_hooks";
import { logger } from "./logger.js";

const requestStore =
  new AsyncLocalStorage();

const SLOW_QUERY_MS =
  Number(process.env.SLOW_QUERY_MS) ||
  250;

let instrumented = false;

const getQueryFilter = (query) => {
  if (
    query &&
    typeof query.getFilter === "function"
  ) {
    return query.getFilter();
  }

  return undefined;
};

const getQueryOptions = (query) => {
  if (
    query &&
    typeof query.getOptions === "function"
  ) {
    return query.getOptions();
  }

  return undefined;
};

const logMongoOperation = ({
  collection,
  operation,
  durationMs,
  filter,
  options,
}) => {
  if (durationMs < SLOW_QUERY_MS) {
    return;
  }

  const context =
    requestStore.getStore() || {};

  logger.warn({
    event: "slow_mongo_query",
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    collection,
    operation,
    durationMs: Number(
      durationMs.toFixed(2)
    ),
    thresholdMs: SLOW_QUERY_MS,
    filter,
    options,
  });
};

export const requestPerformanceContext =
  (req, res, next) => {
    requestStore.run(
      {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
      },
      next
    );
  };

export const instrumentMongoosePerformance =
  () => {
    if (instrumented) {
      return;
    }

    instrumented = true;

    const originalQueryExec =
      mongoose.Query.prototype.exec;

    mongoose.Query.prototype.exec =
      async function instrumentedQueryExec(...args) {
        const startedAt =
          process.hrtime.bigint();

        try {
          return await originalQueryExec.apply(
            this,
            args
          );
        } finally {
          const durationMs =
            Number(
              process.hrtime.bigint() -
                startedAt
            ) / 1e6;

          logMongoOperation({
            collection:
              this.model?.collection?.name,
            operation: this.op,
            durationMs,
            filter: getQueryFilter(this),
            options: getQueryOptions(this),
          });
        }
      };

    const originalAggregateExec =
      mongoose.Aggregate.prototype.exec;

    mongoose.Aggregate.prototype.exec =
      async function instrumentedAggregateExec(
        ...args
      ) {
        const startedAt =
          process.hrtime.bigint();

        try {
          return await originalAggregateExec.apply(
            this,
            args
          );
        } finally {
          const durationMs =
            Number(
              process.hrtime.bigint() -
                startedAt
            ) / 1e6;

          logMongoOperation({
            collection:
              this._model?.collection?.name,
            operation: "aggregate",
            durationMs,
            filter: this.pipeline(),
            options: this.options,
          });
        }
      };
  };

