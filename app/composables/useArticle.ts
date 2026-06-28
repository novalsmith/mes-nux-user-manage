import { useArticleService } from "~~/services/article.service";

// app/composables/useArticle.ts
export const useArticle = async () => {
  const service = useArticleService();
  
  // Mengambil kedua data sekaligus secara paralel
  const [articles, recipes] = await Promise.all([
    service.getArticles("article"),
    service.getArticles("recipe")
  ]);
  
  return { articles, recipes };
};