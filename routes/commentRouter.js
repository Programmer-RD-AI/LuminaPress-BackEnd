import express from 'express'
import {
  validateCommentInput,
  validateArticleId,
  handleErrors
} from '../middlewares/commentMiddleware.js'
import {
  addCommentHandler,
  getCommentsHandler
} from '../handlers/commentHandlers.js'

const commentRouter = express.Router()

// Route to add a comment
commentRouter.post('/', validateCommentInput, addCommentHandler)

// Route to get comments for an article
commentRouter.get('/:articleId', validateArticleId, getCommentsHandler)

// Use error-handling middleware
commentRouter.use(handleErrors)

export default commentRouter
