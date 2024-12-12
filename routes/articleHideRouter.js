import express from "express";
import { azureCosmosSQLArticles } from "../config/AzureCosmosConfig.js";

const articleHideRouter = express.Router();

// Hide an article
articleHideRouter.post("/", async (req, res, next) => {
  try {
    const { articleId } = req.body;
    if (!articleId) {
      return res.status(400).json({
        error: "Article ID is required",
      });
    }

    // Read the current article
    const article = await azureCosmosSQLArticles.read(articleId);

    // Update the article with hidden status
    const updatedArticle = await azureCosmosSQLArticles.update(articleId, {
      ...article,
      isHidden: true,
    });

    res.status(200).json({
      message: "Article hidden successfully",
      article: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
});

// Unhide an article
articleHideRouter.put("/", async (req, res, next) => {
  try {
    const { articleId } = req.body;
    if (!articleId) {
      return res.status(400).json({
        error: "Article ID is required",
      });
    }

    // Read the current article
    const article = await azureCosmosSQLArticles.read(articleId);

    // Update the article with hidden status
    const updatedArticle = await azureCosmosSQLArticles.update(articleId, {
      ...article,
      isHidden: false,
    });

    res.status(200).json({
      message: "Article unhidden successfully",
      article: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
});

// Get all articles with their hidden status
articleHideRouter.get("/", async (req, res, next) => {
  try {
    // Query to retrieve all articles with their hidden status
    const query = "SELECT c.id, c.isHidden FROM c";
    const results = await azureCosmosSQLArticles.query(query);

    res.status(200).json({
      articles: results.resources.map((article) => ({
        id: article.id,
        isHidden: article.isHidden || false,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Error-handling middleware
articleHideRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "An unexpected error occurred",
    details: err.message,
  });
});

export default articleHideRouter;
