/**
 * Middleware to validate request body for viewing an article.
 */
export const validateViewArticleRequest = (req, res, next) => {
  const { userId, articleId } = req.body

  if (!articleId) {
    return res.status(400).json({ message: 'Article ID is required' })
  }

  next()
}
