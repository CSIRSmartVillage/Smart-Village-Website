import ApiError from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let error = err;

  if (
    error?.name ===
    "MulterError"
  ) {
    error = new ApiError(
      400,
      error.code ===
        "LIMIT_FILE_SIZE"
        ? "The selected file exceeds the upload size limit"
        : error.message
    );
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }

  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode,
    },
  });
};

export default errorHandler;