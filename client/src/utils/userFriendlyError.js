const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const getTechnicalText = (error) =>
  [
    error?.code,
    error?.name,
    error?.message,
    error?.response?.data?.message,
    error?.response?.data?.error?.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const isNotFoundError = (error) =>
  error?.response?.status === 404 || error?.status === 404;

export const getUserFriendlyError = (error, options = {}) => {
  const normalizedOptions =
    typeof options === "string" ? { fallback: options } : options;
  const {
    fallback = DEFAULT_ERROR_MESSAGE,
    context,
    action,
  } = normalizedOptions;
  const status = error?.response?.status ?? error?.status;
  const technicalText = getTechnicalText(error);

  if (technicalText.includes("cancel")) {
    return fallback;
  }

  if (
    status === 413 ||
    technicalText.includes("limit_file_size") ||
    technicalText.includes("file too large") ||
    technicalText.includes("payload too large")
  ) {
    return "The selected file is too large. Please choose a smaller file.";
  }

  if (
    status === 415 ||
    technicalText.includes("invalid file type") ||
    technicalText.includes("unsupported file") ||
    technicalText.includes("files are allowed")
  ) {
    return "This file format is not supported. Please choose a valid file.";
  }

  if (
    technicalText.includes("duplicate key") ||
    technicalText.includes("e11000") ||
    (status === 409 &&
      (technicalText.includes("already exists") ||
        technicalText.includes("already uses")))
  ) {
    return "This information already exists. Please check the details and try again.";
  }

  if (context === "login" && status === 401) {
    return "The username or password you entered is incorrect.";
  }

  if (
    !error?.response &&
    (error?.request ||
      technicalText.includes("network error") ||
      technicalText.includes("failed to fetch") ||
      technicalText.includes("econnrefused") ||
      technicalText.includes("load failed"))
  ) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  switch (status) {
    case 400:
      return "Some information entered is not valid. Please check the details and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested information could not be found.";
    case 409:
      return "This action conflicts with existing information. Please review the details and try again.";
    case 422:
      return "Some information is incomplete or invalid. Please check the form and try again.";
    case 423:
      return "Your account is temporarily locked. Please try again later.";
    case 429:
      return "Too many requests were made. Please wait a moment and try again.";
    case 500:
      return "Something went wrong on our side. Please try again in a few moments.";
    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable. Please try again shortly.";
    default:
      if (action === "upload") {
        return "We could not upload the file. Please try again.";
      }

      return fallback;
  }
};

export default getUserFriendlyError;