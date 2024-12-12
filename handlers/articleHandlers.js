import { DateTime } from "luxon";
import {
  azureCosmosSQLArticles,
  azureCosmosSQLUsers,
} from "../config/AzureCosmosConfig.js";
import { MAX_ARTICLES, MAX_RECOMMENDATIONS } from "../config/generalConfig.js";
import { recommendArticles } from "../utils/recommendation.js";
export const fetchAndUpdateArticle = async (req, res, next) => {
  const { articleId, userId } = req.query;
  try {
    // Fetch article by articleId, ensuring it's not hidden
    let { resources: article } = await azureCosmosSQLArticles.query(
      `SELECT * FROM c WHERE c.id = @articleId AND (c.isHidden = false OR c.isHidden = undefined)`,
      [{ name: "@articleId", value: articleId }]
    );
    article = article[0]; // Get the first (and only) article if found
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // If userId is provided, handle the user-specific logic
    if (userId) {
      // Fetch user by userId
      let { resources: user } = await azureCosmosSQLUsers.query(
        `SELECT * FROM c WHERE c.id = @userId`,
        [{ name: "@userId", value: userId }]
      );

      user = user[0]; // Get the first (and only) user if found

      if (user) {
        // If the article is not in the user's viewed list, add it
        if (!user.viewedArticles.includes(articleId)) {
          user.viewedArticles.push(articleId);

          // Ensure the viewed list doesn't exceed the max limit
          if (user.viewedArticles.length > MAX_ARTICLES) {
            user.viewedArticles.shift(); // Remove the oldest viewed article
          }

          await azureCosmosSQLUsers.update(user.id, user, 1);
        }
      }

      // Update the article's view count and view history
      article.views += 1;
      article.view_history.push(DateTime.now().toISO()); // Add the current timestamp to the history
      await azureCosmosSQLArticles.update(article.id, article);
    }

    res.status(200).json(article);
  } catch (error) {
    next(error); // Forward the error to the error-handling middleware
  }
};
export const fetchArticles = async (req, res, next) => {
  const { type, userId, tag } = req.query;
  const currentDateTime = DateTime.now();
  let query = `SELECT * FROM c WHERE (c.isHidden = false OR c.isHidden = undefined)`;
  let parameters = [];

  try {
    // Build query based on type
    if (type === "new") {
      const last48HoursDate = currentDateTime.minus({ hours: 1000 }).toISO();
      query += ` ORDER BY c.publishedAt DESC`;
    } else if (type === "popular") {
      query += ` ORDER BY c.views DESC`;
    } else if (type === "trending") {
      query += ` ORDER BY c.view_history DESC`;
    }

    // Add tag filtering
    if (tag) {
      query += ` AND ARRAY_CONTAINS(c.tags, @tag)`;
      parameters.push({ name: "@tag", value: tag });
    }

    // Fetch articles
    const { resources: articles } = await azureCosmosSQLArticles.query(
      query,
      parameters
    );

    if (userId) {
      const recommendations = await getRecommendations(userId, articles);
      return res.status(200).json({ articles: recommendations });
    }
    res.status(200).json({ articles });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (userId, articles) => {
  const userQuery = {
    query: `SELECT * FROM c WHERE c.id = @userId`,
    parameters: [{ name: "@userId", value: userId }],
  };

  const { resources: users } = await azureCosmosSQLUsers.query(
    userQuery.query,
    userQuery.parameters
  );

  if (users.length === 0) return articles;

  const user = users[0];
  const viewedArticleIds = user.viewedArticles || [];

  if (viewedArticleIds.length > 0) {
    const viewedQuery = {
      query: `SELECT * FROM c WHERE ARRAY_CONTAINS(@viewedIds, c.id) AND (c.isHidden = false OR c.isHidden = undefined)`,
      parameters: [{ name: "@viewedIds", value: viewedArticleIds }],
    };

    const { resources: viewedArticles } = await azureCosmosSQLUsers.query(
      viewedQuery.query,
      viewedQuery.parameters
    );

    const viewedTitles = viewedArticles.map((a) => a.title);
    const currentTitles = articles.map((a) => a.title);

    const recommendedArticles = await recommendArticles(
      viewedTitles,
      currentTitles
    );

    return recommendedArticles
      .slice(0, MAX_RECOMMENDATIONS)
      .map(({ article, score }) => ({
        ...articles.find((a) => a.title === article),
        score,
      }))
      .filter(Boolean);
  }

  return articles;
};
/**
 * Search articles based on query parameters 'q' and 'tags'.
 */
export const searchArticlesHandler = async (req, res) => {
  const { q, tags } = req.query;

  try {
    const querySpec = {
      query: `SELECT * FROM c WHERE 
                (c.isHidden = false OR c.isHidden = undefined) AND 
                (@query = "" OR CONTAINS(c.title, @query) OR CONTAINS(c.description, @query)) 
                AND (@tags = [] OR ARRAY_CONTAINS(c.tags, @tags))`,
      parameters: [
        { name: "@query", value: q || "" },
        { name: "@tags", value: tags ? tags.split(",") : [] },
      ],
    };

    const { resources: articles } = await azureCosmosSQLArticles.query(
      querySpec.query,
      querySpec.parameters
    );

    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).json({ message: "Error searching articles" });
  }
};
