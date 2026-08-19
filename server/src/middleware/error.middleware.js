import { logger } from "../config/logger.js";

const TEMPORARY_SERVICE_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
]);

const getStatusCode = (error) => {
  if (error?.name === "MulterError") {
    return error?.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  }

  if (
    error?.type === "entity.too.large" ||
    error?.status === 413
  ) {
    return 413;
  }

  if (error?.code === 11000) {
    return 409;
  }

  if (
    error?.name === "CastError" ||
    error?.name === "ValidationError" ||
    error?.name === "ZodError" ||
    error?.type === "entity.parse.failed"
  ) {
    return 400;
  }

  if (
    error?.name === "JsonWebTokenError" ||
    error?.name === "TokenExpiredError" ||
    error?.name === "NotBeforeError"
  ) {
    return 401;
  }

  if (TEMPORARY_SERVICE_CODES.has(error?.code)) {
    return 503;
  }

  const statusCode = Number(error?.statusCode || error?.status);

  return statusCode >= 400 && statusCode <= 599
    ? statusCode
    : 500;
};

const getSafeMessage = (statusCode, error, req) => {
  const technicalMessage = String(error?.message || "").toLowerCase();
  const requestPath = String(req?.originalUrl || "").toLowerCase();
  const isUploadRequest =
    requestPath.includes("upload") ||
    requestPath.includes("media") ||
    requestPath.includes("survey");

  if (
    statusCode === 413 ||
    error?.code === "LIMIT_FILE_SIZE"
  ) {
    return "The selected file is too large. Please choose a smaller file.";
  }

  if (
    isUploadRequest &&
    (error?.name === "MulterError" ||
      technicalMessage.includes("only images") ||
      technicalMessage.includes("file type") ||
      technicalMessage.includes("not supported") ||
      technicalMessage.includes("files are allowed") ||
      technicalMessage.includes(".xlsx"))
  ) {
    return "This file format is not supported. Please choose a valid file.";
  }

  if (
    isUploadRequest &&
    technicalMessage.includes("no file")
  ) {
    return "Please select a file before uploading.";
  }

  if (
    statusCode === 401 &&
    requestPath.includes("/auth/login")
  ) {
    return "The username or password you entered is incorrect.";
  }

  if (
    statusCode === 409 &&
    (error?.code === 11000 ||
      technicalMessage.includes("already exists") ||
      technicalMessage.includes("already uses"))
  ) {
    return "This information already exists. Please check the details and try again.";
  }

  switch (statusCode) {
    case 400:
      return error?.type === "entity.parse.failed"
        ? "The submitted information could not be read. Please check it and try again."
        : "Some information entered is not valid. Please check the details and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested information could not be found.";
    case 409:
      return "This action conflicts with existing information. Please review the details and try again.";
    case 413:
      return "The selected file is too large. Please choose a smaller file.";
    case 415:
      return "This file format is not supported. Please choose a valid file.";
    case 422:
      return requestPath.includes("survey")
        ? "The uploaded file could not be processed. Please check the file and try again."
        : "Some information is incomplete or invalid. Please check the details and try again.";
    case 423:
      return "Your account is temporarily locked. Please try again later.";
    case 429:
      return "Too many requests were made. Please wait a moment and try again.";
    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable. Please try again shortly.";
    default:
      return "Something went wrong on our side. Please try again in a few moments.";
  }
};

const errorHandler = (err, req, res, next) => {
  const statusCode = getStatusCode(err);
  const safeMessage = getSafeMessage(statusCode, err, req);
  const originalError = err || {};

  logger.error({
    message: originalError?.message || "Unhandled server error",
    stack: originalError?.stack,
    errorName: originalError?.name,
    errorCode: originalError?.code,
    keyPattern: originalError?.keyPattern,
    validationErrors: originalError?.errors,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(statusCode).json({
    success: false,
    message: safeMessage,
    error: {
      message: safeMessage,
      statusCode,
    },
  });
};

export default errorHandler;