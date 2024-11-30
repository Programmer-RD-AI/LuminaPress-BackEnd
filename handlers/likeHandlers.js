import { azureCosmosSQLArticles } from '../config/AzureCosmosConfig.js'

/**
 * Handler to like or unlike an article.
 */
export const toggleLikeHandler = async (req, res) => {
  const { articleId, userId, add_or_remove = 'A' } = req.body

  try {
    // Fetch the article from Cosmos DB
    const articleQuerySpec = {
      query: 'SELECT * FROM c WHERE c.id = @articleId',
      parameters: [{ name: '@articleId', value: articleId }]
    }

    let { resources: article } = await azureCosmosSQLArticles.query(
      articleQuerySpec.query,
      articleQuerySpec.parameters
    )

    article = article[0] // Get the first article if found

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    if (add_or_remove === 'R') {
      // Decrement the likes count and remove the user ID from `liked_by` array
      article.likes = article.likes ? article.likes - 1 : 0
      if (article.liked_by) {
        article.liked_by = article.liked_by.filter((id) => id !== userId)
      }
      await azureCosmosSQLArticles.update(articleId, article)
      // Respond with the updated article
      return res.status(200).json({
        message: 'Article unliked successfully',
        articleId,
        likes: article.likes,
        liked_by: article.liked_by
      })
    }

    // Increment the likes count and add the user ID to `liked_by` array if not present
    article.likes = article.likes ? article.likes + 1 : 1

    if (!article.liked_by) {
      article.liked_by = []
    }
    if (!article.liked_by.includes(userId)) {
      article.liked_by.push(userId)
    }

    // Replace the updated article in the database
    await azureCosmosSQLArticles.update(articleId, article)
    // Respond with the updated article
    res.status(200).json({
      message: 'Article liked successfully',
      articleId,
      likes: article.likes,
      liked_by: article.liked_by
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    res.status(500).json({ message: 'Error toggling like' })
  }
}
