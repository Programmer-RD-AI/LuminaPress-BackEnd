import {
  azureCosmosSQLArticles,
  azureCosmosSQLUsers,
} from "../config/AzureCosmosConfig.js";

/**
 * Fetch user profile and associated comments.
 */
export const getUserProfileHandler = async (req, res) => {
  const { userIdAccessing, currentUserId } = req.query;

  try {
    // Fetch user profile
    const { resources: userProfile } = await azureCosmosSQLUsers.query(
      "SELECT * FROM c WHERE c.id = @userId",
      [{ name: "@userId", value: userIdAccessing }]
    );

    if (userProfile.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userProfile[0];
    if (user.private && currentUserId !== userIdAccessing) {
      return res.status(403).json({ message: "User profile is private" });
    }

    // Fetch articles with comments from this user
    const { resources: articles } = await azureCosmosSQLArticles.query(
      "SELECT * FROM c WHERE ARRAY_CONTAINS(c.comments, { userId: @userId }, true)",
      [{ name: "@userId", value: userIdAccessing }]
    );

    // Extract and structure user comments
    const userComments = articles
      .map((article) => {
        const comments = article.comments.filter(
          (comment) => comment.userId === userIdAccessing
        );
        return {
          articleId: article.id,
          articleTitle: article.title,
          comments: comments.map((comment) => ({
            content: comment.content,
            timestamp: comment.timestamp,
            likes: comment.likes || 0,
          })),
        };
      })
      .filter((article) => article.comments.length > 0);

    // Add comments to user profile response
    const response = {
      ...user,
      commentedArticles: userComments,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Internal Server Error");
  }
};
/**
 * Toggle user profile privacy status.
 */
export const toggleUserPrivacyHandler = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    // Fetch user profile
    let { resources: userProfile } = await azureCosmosSQLUsers.query(
      "SELECT * FROM c WHERE c.id = @userId",
      [{ name: "@userId", value: userId }]
    );

    if (userProfile.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle privacy status
    const user = userProfile[0];
    user.private = !user.private;

    // Update the database
    await azureCosmosSQLUsers.update(userId, user, 1);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user privacy:", error);
    res.status(500).send("Internal Server Error");
  }
};
