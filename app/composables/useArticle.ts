// app/composables/useArticle.ts
import { useArticleService } from "~~/services/article.service";
export const useArticle = async () => {
  const service = useArticleService();
  
  const [articles] = await Promise.all([
    service.getArticles("article"),
  ]);
  
  return { articles };
};

export const useRecipes = async () => {
  const service = useArticleService();
  
  const [recipes] = await Promise.all([
    service.getArticles("recipe")
  ]);
  
  return { recipes };
}; 