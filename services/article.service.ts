// app/services/article.service.ts
import { useArticleApi } from "~/infrastructure/api/article.api";

export const useArticleService = () => {
  const repo = useArticleApi(); 

  return {
    // Tambahkan tipe parameter di sini juga
    getArticles: (type: 'article' | 'recipe' = 'article') => repo.findAll(type)
  };
};