import { query, validationResult } from 'express-validator'

export const validateArticleQueries = [
  query('type')
    .optional()
    .isIn(['new', 'popular', 'trending'])
    .withMessage("Type must be 'new', 'popular', or 'trending'"),
  query('userId').optional().isString().withMessage('User ID must be a string'),
  query('tag').optional().isString().withMessage('Tag must be a string'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
