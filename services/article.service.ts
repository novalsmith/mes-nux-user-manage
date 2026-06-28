// services/article.service.ts
import { useArticleApi } from "@/infrastructure/api/article.api";

export const useArticleService = () => {
  const api = useArticleApi();

  return {
    getArticles: async (type: string) => {
      // Logika service untuk list
      return await api.findAll();
    },
    // Tambahkan implementasi di sini:
    getArticleById: async (id: string) => {
      // Memanggil API layer
      // Gunakan proxy yang sudah kita bahas sebelumnya
      return await $fetch(`/api/drupal/node/article/${id}?include=field_media_image,field_media_image.field_media_image`);
    }
  };
};