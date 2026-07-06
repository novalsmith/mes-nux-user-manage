// app/implementation/article.api.ts
import type { ArticleRepository } from '../repository/article.repository';

export const useArticleApi = (): ArticleRepository => {
  // Ganti drupalBaseUrl eksternal dengan proxy internal Nuxt
  const jsonPath = '/api/drupal/jsonapi/node';

  return {
    async findAll(): Promise<any> {
      const url = `${jsonPath}/article?include=field_media_image,field_media_image.field_media_image,field_tags`;
      const { data, error } = await useFetch<any>(url);
      
      if (error.value) return null;
      return data.value; 
    },

    async findById(id: string): Promise<any> {
      const url = `${jsonPath}/article/${id}?include=field_media_image,field_media_image.field_media_image,field_tags`;
      const { data, error } = await useFetch<any>(url);

      if (error.value) throw new Error(`Gagal fetch id: ${id}`);
      return data.value;  
    },

    async findByTag(tagId: string): Promise<any> {
      const url = `${jsonPath}/article?filter[field_tags.id]=${tagId}&include=field_media_image,field_media_image.field_media_image,field_tags`;
      const { data, error } = await useFetch<any>(url);

      if (error.value) return null;
      return data.value; 
    }
  };
};