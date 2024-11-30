/**
 * Middleware to validate input for the like/unlike request.
 */
export const validateLikeInput = (req, res, next) => {
  const { articleId, userId } = req.body

  if (!articleId || !userId) {
    return res
      .status(400)
      .json({ message: 'Article ID and User ID are required' })
  }

  next()
}
