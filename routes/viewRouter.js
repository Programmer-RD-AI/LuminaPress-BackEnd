import { Router } from 'express'
import { validateViewArticleRequest } from '../middlewares/validateViewArticleRequest.js'
import { viewArticleHandler } from '../handlers/viewArticleHandlers.js'

const viewRouter = Router()
// POST: View an article and update its view count and history
viewRouter.post('/', validateViewArticleRequest, viewArticleHandler)

export default viewRouter
