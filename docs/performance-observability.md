# Performance Observability

This project emits passive performance telemetry for API requests, MongoDB queries, browser Web Vitals, and client API calls.

## Backend Logs

### API Request Timing

Every request receives an `x-request-id` response header. If the client sends `x-request-id`, the backend preserves it; otherwise the backend generates one.

Log event names:

- `api_request`: normal API request timing.
- `slow_api_request`: request duration exceeded `SLOW_REQUEST_MS`.

Fields:

- `requestId`: correlation ID shared with frontend logs.
- `method`: HTTP method.
- `path`: full request path.
- `statusCode`: response status.
- `durationMs`: total Express request duration.
- `contentLength`: response body size when available.
- `userAgent`: client user agent.
- `ip`: request IP.

Default slow request threshold: `1000ms`.

Override with:

```bash
SLOW_REQUEST_MS=750
```

### Slow MongoDB Query Logs

Log event name:

- `slow_mongo_query`

Fields:

- `requestId`: API request ID active when the query ran.
- `method`: HTTP method.
- `path`: API route that triggered the query.
- `collection`: MongoDB collection.
- `operation`: Mongoose operation, such as `find`, `findOne`, `aggregate`.
- `durationMs`: query execution duration.
- `filter`: query filter or aggregation pipeline.
- `options`: query options.

Default slow query threshold: `250ms`.

Override with:

```bash
SLOW_QUERY_MS=200
```

## Frontend Logs

Browser performance logs are emitted to the console with the `[performance]` prefix.

Metrics:

- `first-paint`
- `first-contentful-paint`
- `LCP`
- `CLS`
- `INP_candidate`
- `api_request`

Frontend API logs include:

- `requestId`
- `method`
- `url`
- `status`
- `durationMs`

The same `requestId` is sent to the backend as `x-request-id`, allowing frontend API timing logs to be matched with backend request timing and slow MongoDB query logs.

## How To Identify Bottlenecks

1. Find a slow frontend `api_request` log in the browser console.
2. Copy the `requestId`.
3. Search backend logs for the same `requestId`.
4. Compare frontend `durationMs` with backend `api_request.durationMs`.
5. If frontend is much slower, investigate network, cold start, DNS, TLS, or browser-side blocking.
6. If backend is slow, inspect `slow_mongo_query` logs with the same `requestId`.
7. If MongoDB queries are slow, use the logged `collection`, `operation`, `filter`, and `options` to run `explain("executionStats")` in MongoDB Atlas.
8. For page-load UX issues, compare `LCP`, `CLS`, and API timing around `/public/pages/home`, navigation, states, and hero assets.

## Log Locations

The Winston logger writes to:

- `logs/app.log`
- `logs/error.log`

In non-production environments, logs are also written to the console.

