/**
 * Middleware to validate the presence of userId in the request.
 */
export const validateUserIdQuery = (req, res, next) => {
  const { userIdAccessing } = req.query

  if (!userIdAccessing) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  next()
}

export const validateUserIdBody = (req, res, next) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  next()
}
