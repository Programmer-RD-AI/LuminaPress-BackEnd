import { Router } from "express";
import { validateArticleQueries } from "../middlewares/validateArticleQueries.js";
import { fetchArticles } from "../handlers/articleHandlers.js";
import { handleErrors } from "../middlewares/handleErrors.js";
import {
  validateArticleRequest,
  validateUserQuery,
} from "../middlewares/validateRequest.js";
import { fetchAndUpdateArticle } from "../handlers/articleHandlers.js";
import { validateSearchQueryParams } from "../middlewares/searchMiddleware.js";
import { searchArticlesHandler } from "../handlers/articleHandlers.js";

const articlesRouter = Router();

articlesRouter.get("/articles", validateArticleQueries, fetchArticles);
articlesRouter.get(
  "/article",
  validateArticleRequest,
  validateUserQuery,
  fetchAndUpdateArticle
);
// GET: Search articles based on query parameters 'q' and 'tags'
articlesRouter.get("/search", validateSearchQueryParams, searchArticlesHandler);

// Error-handling middleware
articlesRouter.use(handleErrors);

export default articlesRouter;
