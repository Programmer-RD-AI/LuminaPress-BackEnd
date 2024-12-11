import express from "express";
import { azureCosmosSQLUsers } from "../config/AzureCosmosConfig.js";

const bookMarkRouter = express.Router();

// Route to add a bookmark
bookMarkRouter.post("/", async (req, res, next) => {
  try {
    const { userId, articleId } = req.body;

    // Validate input
    if (!userId || !articleId) {
      return res
        .status(400)
        .json({ message: "User ID and Article ID are required" });
    }

    // Read the user
    const user = await azureCosmosSQLUsers.read(userId);

    // Check if the article is already bookmarked
    if (user.bookmarks.includes(articleId)) {
      return res.status(400).json({ message: "Article already bookmarked" });
    }

    // Add the article to bookmarks
    user.bookmarks.push(articleId);

    // Update the user in the database
    await azureCosmosSQLUsers.update(userId, user);

    res.status(200).json({
      message: "Bookmark added successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(error);
  }
});

// Route to remove a bookmark
bookMarkRouter.delete("/", async (req, res, next) => {
  try {
    const { userId, articleId } = req.body;

    // Validate input
    if (!userId || !articleId) {
      return res
        .status(400)
        .json({ message: "User ID and Article ID are required" });
    }

    // Read the user
    const user = await azureCosmosSQLUsers.read(userId);

    // Remove the article from bookmarks
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark !== articleId,
    );

    // Update the user in the database
    await azureCosmosSQLUsers.update(userId, user);

    res.status(200).json({
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(error);
  }
});

// Use error-handling middleware

export default bookMarkRouter;
