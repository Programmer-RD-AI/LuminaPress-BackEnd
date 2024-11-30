/**
 * Middleware to validate query parameters for searching articles.
 */
export const validateSearchQueryParams = (req, res, next) => {
  const { q, tags } = req.query;

  // Validate query string and tags
  if (q && typeof q !== "string") {
    return res
      .status(400)
      .json({ message: "Query parameter 'q' should be a string" });
  }

  if (tags && typeof tags !== "string") {
    return res
      .status(400)
      .json({ message: "Tags parameter should be a string" });
  }

  next();
};
