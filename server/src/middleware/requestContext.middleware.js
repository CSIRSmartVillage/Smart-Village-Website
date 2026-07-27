import crypto from "crypto";

const REQUEST_ID_HEADER = "x-request-id";

export const requestContext = (req, res, next) => {
  const incomingRequestId =
    req.get(REQUEST_ID_HEADER);

  req.requestId =
    incomingRequestId ||
    crypto.randomUUID();

  res.setHeader(
    REQUEST_ID_HEADER,
    req.requestId
  );

  next();
};

