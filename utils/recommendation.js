import axios from 'axios'

// Hugging Face API key and model endpoint
const HF_API_KEY = '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' // Replace with your Hugging Face API key
const modelUrl =
  'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2'

// Function to fetch similarity scores from the Hugging Face API
async function getEmbeddings (sourceSentence, sentences) {
  try {
    const response = await axios.post(
      modelUrl,
      {
        inputs: {
          source_sentence: sourceSentence,
          sentences
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`
        }
      }
    )
    return response.data // API returns an array of similarity scores
  } catch (error) {
    console.error(
      'Error while fetching embeddings from Hugging Face API:',
      error.response?.data || error.message
    )
    throw new Error('Failed to fetch embeddings')
  }
}

// Function to recommend articles based on similarity scores
async function recommendArticles (previousArticles, currentArticles) {
  const previousArticlesToUse = previousArticles.slice(0, 100) // Max 100 articles
  const currentArticlesToUse = currentArticles.slice(0, 20) // Max 20 articles

  const recommendedArticles = []

  // Loop through current articles to calculate similarity scores
  for (const currentArticle of currentArticlesToUse) {
    try {
      // Fetch similarity scores
      const similarities = await getEmbeddings(
        currentArticle,
        previousArticlesToUse
      )

      // Calculate the average similarity score for the current article
      const totalScore = similarities.reduce((acc, sim) => acc + sim, 0)
      const averageScore =
        similarities.length > 0 ? totalScore / similarities.length : 0

      // Add to recommendations list
      recommendedArticles.push({
        article: currentArticle,
        score: averageScore
      })
    } catch (error) {
      console.error(
        `Error processing article "${currentArticle}":`,
        error.message
      )
      recommendedArticles.push({
        article: currentArticle,
        score: 0 // Default score in case of error
      })
    }
  }

  // Sort recommended articles by similarity score in descending order
  recommendedArticles.sort((a, b) => b.score - a.score)

  return recommendedArticles
}

// // Example usage
// (async () => {
//   const previousArticles = [
//     "Sample Article Title 1",
//     "Sample Article Title 2",
//     "Sample Article Title 3",
//   ];
//   const currentArticles = [
//     "Sample Article Title 8",
//     "Sample Article Title 9",
//     "Sample Article Title 10",
//   ];

//   try {
//     const recommendations = await recommendArticles(
//       previousArticles,
//       currentArticles
//     );
//     console.log("Recommended Articles:", recommendations);
//   } catch (error) {
//     console.error("Error generating recommendations:", error.message);
//   }
// })();

export default recommendArticles
