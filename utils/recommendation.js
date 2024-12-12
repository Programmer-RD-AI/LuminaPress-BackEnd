import natural from "natural";
import stopword from "stopword";

class AdvancedArticleRecommender {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  /**
   * Preprocess text by tokenizing, removing stopwords, and stemming
   * @param {string} text - Input text to preprocess
   * @returns {string[]} Processed tokens
   */
  preprocessText(text) {
    // Tokenize and convert to lowercase
    const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];

    // Remove stopwords and apply stemming
    const cleanedTokens = stopword.removeStopwords(tokens);
    return cleanedTokens.map((token) => this.stemmer.stem(token));
  }

  /**
   * Calculate semantic similarity between two texts
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score
   */
  calculateSemanticSimilarity(text1, text2) {
    const tokens1 = new Set(this.preprocessText(text1));
    const tokens2 = new Set(this.preprocessText(text2));

    // Jaccard similarity with advanced calculation
    const intersection = [...tokens1].filter((token) => tokens2.has(token));
    const union = new Set([...tokens1, ...tokens2]);

    // Weighted similarity with length bonus
    const baseScore = intersection.length / union.size;
    const lengthBonus = Math.min(
      1,
      (intersection.length / Math.min(tokens1.size, tokens2.size)) * 1.5
    );

    return baseScore * lengthBonus;
  }

  /**
   * Extract key topics from a text
   * @param {string} text - Input text
   * @returns {string[]} Top 3 key topics
   */
  extractKeyTopics(text) {
    const tokens = this.preprocessText(text);
    const frequencyDistribution = new Map();

    tokens.forEach((token) => {
      frequencyDistribution.set(
        token,
        (frequencyDistribution.get(token) || 0) + 1
      );
    });

    // Top 3 key topics by frequency
    return Array.from(frequencyDistribution.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);
  }

  /**
   * Recommend articles based on semantic similarity
   * @param {string[]} previousArticles - List of previous articles
   * @param {string[]} currentArticles - List of current articles to recommend
   * @returns {Object[]} Sorted recommendations with similarity scores
   */
  recommendArticles(previousArticles, currentArticles) {
    const recommendations = [];

    for (const currentArticle of currentArticles) {
      const similarities = previousArticles.map((prevArticle) => ({
        article: prevArticle,
        similarity: this.calculateSemanticSimilarity(
          currentArticle,
          prevArticle
        ),
      }));

      // Sort similarities in descending order
      similarities.sort((a, b) => b.similarity - a.similarity);

      // Top match
      const topMatch = similarities[0] || { article: null, similarity: 0 };
      const keyTopics = this.extractKeyTopics(currentArticle);

      recommendations.push({
        article: currentArticle,
        score: topMatch.similarity,
        similarTo: topMatch.article,
        matchReasons: keyTopics.map((topic) => `Shares topic: ${topic}`),
      });
    }

    // Sort recommendations by score
    return recommendations.sort((a, b) => b.score - a.score);
  }
}

// Singleton instance for easy use
export const articleRecommender = new AdvancedArticleRecommender();

/**
 * Convenience function for recommending articles
 * @param {string[]} previousArticles - List of previous articles
 * @param {string[]} currentArticles - List of current articles to recommend
 * @returns {Object[]} Sorted recommendations
 */
export function recommendArticles(previousArticles, currentArticles) {
  const responses = articleRecommender
    .recommendArticles(previousArticles, currentArticles)
    .reverse();
  return responses;
}

export default recommendArticles;
