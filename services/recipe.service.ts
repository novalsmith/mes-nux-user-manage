// services/recipe.service.ts
import { useRecipeApi } from "@/infrastructure/api/recipe.api";

export const useRecipeService = () => {
  const api = useRecipeApi();

  return {
    getRecipes: async () => {
      // Logika service untuk list
      return await api.findAll();
    },
    // Tambahkan implementasi di sini:
    getRecipeById: async (id: string) => {
      // Memanggil API layer
      // Gunakan proxy yang sudah kita bahas sebelumnya
      return await $fetch(`/api/drupal/node/recipe/${id}?include=field_media_image,field_media_image.field_media_image`);
    }
  };
};