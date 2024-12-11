import { DateTime } from "luxon"; // To handle current timestamp (ensure to install luxon if not already done)
import {
  azureCosmosSQLArticles,
  azureCosmosSQLUsers,
} from "../config/AzureCosmosConfig.js";
/**
 * Handler to view an article and update the view count and history.
 */
export const viewArticleHandler = async (req, res) => {
  const { userId, articleId } = req.body;

  try {
    // Fetch the article
    const articleQuerySpec = {
      query: `SELECT * FROM c WHERE c.id = @articleId`,
      parameters: [{ name: "@articleId", value: articleId }],
    };

    let { resources: article } = await azureCosmosSQLArticles.query(
      articleQuerySpec.query,
      articleQuerySpec.parameters
    );

    article = article[0];
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Update the article view count and view history
    article.views += 1;
    article.view_history.push(DateTime.now().toISO()); // Add the current timestamp

    // If userId is provided, update user's viewed articles
    if (userId) {
      const userQuerySpec = {
        query: `SELECT * FROM c WHERE c.id = @userId`,
        parameters: [{ name: "@userId", value: userId }],
      };

      let { resources: user } = await azureCosmosSQLUsers.query(
        userQuerySpec.query,
        userQuerySpec.parameters
      );

      user = user[0];
      if (user) {
        // Add the article to the user's viewed articles
        if (!user.viewedArticles.includes(articleId)) {
          user.viewedArticles.push(articleId);

          // If the user has more than the allowed max articles viewed, remove the oldest
          const MAX_ARTICLES = 10; // Adjust this value as needed
          if (user.viewedArticles.length > MAX_ARTICLES) {
            user.viewedArticles.shift();
          }

          // Save the user data back
          await azureCosmosSQLUsers.update(user.id, user.id, user);
        }
      }
    }

    // Update the article in the database
    await azureCosmosSQLArticles.update(articleId, article);
    res.status(200).json({
      message: "Article viewed and data updated successfully",
      articleId: articleId,
      views: article.views,
      view_history: article.view_history,
    });
  } catch (error) {
    console.error("Error updating article view:", error);
    res.status(500).json({ message: "Error updating article view" });
  }
};
