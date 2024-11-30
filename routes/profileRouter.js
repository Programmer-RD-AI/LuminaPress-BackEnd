import { Router } from 'express'
import {
  validateUserIdQuery,
  validateUserIdBody
} from '../middlewares/profileMiddleware.js'
import {
  getUserProfileHandler,
  toggleUserPrivacyHandler
} from '../handlers/profileHandlers.js'

const profileRouter = Router()
// GET: Fetch user profile and associated comments
profileRouter.get('/', validateUserIdQuery, getUserProfileHandler)

// POST: Toggle user privacy status
profileRouter.post('/', validateUserIdBody, toggleUserPrivacyHandler)

export default profileRouter
