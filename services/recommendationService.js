export const recommendArticles = async (viewedTitles, currentTitles) => {
  // Mock recommendation logic
  return currentTitles
    .filter((title) => !viewedTitles.includes(title))
    .map((title, idx) => ({
      article: title,
      score: Math.random() * (10 - idx),
    }));
};
