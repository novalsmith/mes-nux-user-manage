import { useArticleService } from "~~/services/article.service";

// app/composables/useArticle.ts
export const useArticle = async () => {
  const service = useArticleService();
  
  // Mengambil kedua data sekaligus secara paralel
  const [articles] = await Promise.all([
    service.getArticles("article"),
    // service.getArticles("recipe")
  ]);
  
  return { articles };
};

export const useRecipes = async () => {
  const service = useArticleService();
  
  // Mengambil kedua data sekaligus secara paralel
  const [recipes] = await Promise.all([
    // service.getArticles("article"),
    service.getArticles("recipe")
  ]);
  
  return { recipes };
};