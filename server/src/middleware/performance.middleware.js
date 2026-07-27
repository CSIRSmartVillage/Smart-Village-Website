import { logger } from "../config/logger.js";

const SLOW_REQUEST_MS =
  Number(process.env.SLOW_REQUEST_MS) ||
  1000;

export const performanceMiddleware =
  (req, res, next) => {
    const startedAt = process.hrtime.bigint();

    res.on("finish", () => {
      const durationMs =
        Number(
          process.hrtime.bigint() - startedAt
        ) / 1e6;

      const logPayload = {
        event: "api_request",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        route: req.route?.path,
        statusCode: res.statusCode,
        durationMs: Number(
          durationMs.toFixed(2)
        ),
        contentLength:
          res.getHeader("content-length") ||
          null,
        userAgent: req.get("user-agent"),
        ip: req.ip,
      };

      if (
        durationMs >= SLOW_REQUEST_MS
      ) {
        logger.warn({
          ...logPayload,
          event: "slow_api_request",
          thresholdMs: SLOW_REQUEST_MS,
        });

        return;
      }

      logger.info(logPayload);
    });

    next();
  };

