import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";

import notFound from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

import path from "path";

import {
  securityMiddleware,
} from "./middleware/security.middleware.js";
import {
  requestContext,
} from "./middleware/requestContext.middleware.js";
import {
  performanceMiddleware,
} from "./middleware/performance.middleware.js";
import {
  requestPerformanceContext,
} from "./config/mongoosePerformance.js";


import { env } from "./config/env.js";

const app = express();
app.set("trust proxy", 1);

// ---------------------------------------------------------------------------
// CORS allowed origins.
//
// CLIENT_URL (server/.env) may be a comma-separated list, e.g.:
//   CLIENT_URL=http://13.x.x.x,https://smart-village-csir-cbri.vercel.app
//
// Requests that arrive through the Nginx reverse proxy from the same host
// do NOT include an Origin header (same-origin request), so they are always
// allowed by the `!origin` branch below — no extra configuration needed for
// the EC2 deployment.
// ---------------------------------------------------------------------------
const configuredClientOrigins = String(env.clientUrl || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedClientOrigins = new Set([
  "http://localhost:5173",
  "https://csirsmartvillage.in",
  "https://www.csirsmartvillage.in",
  "http://smartvillage-frontend.s3-website.ap-south-1.amazonaws.com",
  "https://smartvillage-frontend.s3.ap-south-1.amazonaws.com",
  "https://smart-village-csir-cbri.vercel.app",
  ...configuredClientOrigins,
]);

const isLocalDevelopmentOrigin = (origin) => {
  if (env.nodeEnv === "production") {
    return false;
  }

  try {
    const { hostname, protocol } = new URL(origin);

    return (
      (protocol === "http:" || protocol === "https:") &&
      ["localhost", "127.0.0.1", "::1"].includes(hostname)
    );
  } catch {
    return false;
  }
};

// Log allowed origins at startup for easier debugging.
console.log(
  "[CORS] Allowed origins:",
  [...allowedClientOrigins]
);

if (env.nodeEnv === "production" && configuredClientOrigins.length === 0) {
  console.warn(
    "[CORS] WARNING: CLIENT_URL is not set in server/.env. " +
    "Only the built-in production origins will be accepted. " +
    "Set CLIENT_URL to any additional frontend origin(s), separated by commas."
  );
}

app.use(requestContext);
app.use(requestPerformanceContext);
app.use(performanceMiddleware);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (same-origin through Nginx proxy,
      // health checks, curl, etc.) are safe to accept.
      if (
        !origin ||
        allowedClientOrigins.has(origin) ||
        isLocalDevelopmentOrigin(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS origin is not allowed: ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(securityMiddleware);

app.use(compression());


app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb",
  })
);


app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use("/api", routes);

app.use(notFound);

app.use(errorHandler);

export default app;
