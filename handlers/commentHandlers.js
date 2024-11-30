import { DateTime } from "luxon";
import { azureCosmosSQLArticles } from "../config/AzureCosmosConfig.js";

/**
 * Handler to add a comment to an article.
 */
export const addCommentHandler = async (req, res, next) => {
  const { articleId, userId, comment } = req.body;

  try {
    let { resources: article } = await azureCosmosSQLArticles.query(
      `SELECT * FROM c WHERE c.id = @articleId`,
      [{ name: "@articleId", value: articleId }]
    );

    article = article[0]; // Get the first article if found

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Add the comment to the article
    if (!article.comments) {
      article.comments = [];
    }

    article.comments.push({
      userId,
      comment,
      createdAt: DateTime.now().toISO(),
    });

    // Replace the updated article in the database
    await azureCosmosSQLArticles.update(articleId, article);

    // Respond with the updated article
    res.status(200).json({
      message: "Comment added successfully",
      articleId: articleId,
      comments: article.comments,
    });
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};

/**
 * Handler to retrieve comments for an article.
 */
export const getCommentsHandler = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    let { resources: article } = await azureCosmosSQLArticles.query(
      `SELECT * FROM c WHERE c.id = @articleId`,
      [{ name: "@articleId", value: articleId }]
    );

    article = article[0]; // Get the first article if found

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Respond with the article's comments
    res.status(200).json({
      message: "Comments retrieved successfully",
      comments: article.comments,
    });
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};
