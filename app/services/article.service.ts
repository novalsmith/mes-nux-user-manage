// services/article.service.ts
import { useArticleApi } from "~/implementation/article.api";

export const useArticleService = () => {
  const api = useArticleApi();

  return {
    getArticles: async (type: string) => {
      return await api.findAll();
    },
    // Tambahkan implementasi di sini:
    getArticleById: async (id: string) => {
        return await api.findById(id);
    },
     getTagById: async (id: string) => {
      return await api.findByTag(id);
    }
  };
};

 