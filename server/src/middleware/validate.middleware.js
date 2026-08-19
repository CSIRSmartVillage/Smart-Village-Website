import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            "Request validation failed.",
            error.issues
          )
        );
      }

      next(error);
    }
  };
};

export default validate;