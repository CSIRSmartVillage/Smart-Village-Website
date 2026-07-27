export const publicCache =
  ({
    browserMaxAge = 60,
    edgeMaxAge = 300,
    staleWhileRevalidate = 600,
  } = {}) =>
  (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    res.set(
      "Cache-Control",
      [
        "public",
        `max-age=${browserMaxAge}`,
        `s-maxage=${edgeMaxAge}`,
        `stale-while-revalidate=${staleWhileRevalidate}`,
      ].join(", ")
    );

    return next();
  };

