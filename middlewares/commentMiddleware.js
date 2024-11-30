import { body, param, validationResult } from 'express-validator'

// Middleware to validate `POST /comment` request body
export const validateCommentInput = [
  body('articleId').notEmpty().withMessage('Article ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('comment').notEmpty().withMessage('Comment is required'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Middleware to validate `GET /comment/:articleId` route parameter
export const validateArticleId = [
  param('articleId').notEmpty().withMessage('Article ID is required'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Error-handling middleware
export const handleErrors = (err, req, res, next) => {
  console.error('An error occurred:', err)
  res.status(500).json({ message: 'Internal Server Error' })
}
