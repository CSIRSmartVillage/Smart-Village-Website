import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
  next(
    new ApiError(
      404,
      "The requested route could not be found."
    )
  );
};

export default notFound;