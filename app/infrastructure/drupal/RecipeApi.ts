// app/implementation/recipe.api.ts
import type { RecipeRepository } from '../../repository/RecipeRepository';

export const useRecipeApi = (): RecipeRepository => {
  // Ganti drupalBaseUrl eksternal dengan proxy internal Nuxt
  const jsonPath = '/api/drupal/jsonapi/node/recipe';

  return {
    async findAll(): Promise<any> {
      const url = `${jsonPath}?include=field_media_image,field_media_image.field_media_image,field_tags`;
      const { data, error } = await useFetch<any>(url);
      
      if (error.value) return null;
      return data.value; 
    },

    async findById(id: string): Promise<any> {
      const url = `${jsonPath}/${id}?include=field_media_image,field_media_image.field_media_image,field_tags`;
      const { data, error } = await useFetch<any>(url);

      if (error.value) throw new Error(`Gagal fetch id: ${id}`);
      return data.value;  
    },

    async findByTag(tagId: string): Promise<any> {
      const url = `${jsonPath}?filter[field_tags.id]=${tagId}&include=field_media_image,field_media_image.field_media_image,field_tags`;
      const { data, error } = await useFetch<any>(url);

      if (error.value) return null;
      return data.value; 
    }
  };
};