// infrastructure/api/article.api.ts
import type { RecipeRepository } from '~/repository/recipe.repository';
import type { Recipe } from '@/model/recipe.entity';

export const useRecipeApi = (): RecipeRepository => {
  const config = useRuntimeConfig();
    const drupalBaseUrl = config.public.drupalBaseUrl;

  
  return {
          async findAll(): Promise<Recipe[]> {
            // Bangun URL secara manual untuk menghindari masalah encoding query
            const baseUrl = `${drupalBaseUrl}/recipe`;
            const includeParams = 'include=field_media_image,field_media_image.field_media_image';
            const url = `${baseUrl}?${includeParams}`;
            
          const { data, error } = await useFetch(url);
            
          if (error.value) {
              console.error("Error dari Proxy/Drupal:", error.value);
              return [];
            }

            const raw = data.value as any;
            if (!raw?.data) return [];

                return raw.data.map((item: any) => {

            const mediaId = item.relationships?.field_media_image?.data?.id;  
            const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);  
            const fileId = mediaItem?.relationships?.field_media_image?.data?.id;  
            const fileItem = raw.included?.find((inc: any) => inc.id === fileId);  
              const imageUrl = fileItem?.attributes?.uri?.url 
                ? `${drupalBaseUrl}${fileItem.attributes.uri.url}` 
                : null;

            return {
                id: item.id,
                title: item.attributes.title,
                image: imageUrl,
                path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`
              };
          });
        },

        async findById(id: string): Promise<Recipe> {
      const { data, error } = await useFetch(`${drupalBaseUrl}/recipe/${id}?include=field_media_image,field_media_image.field_media_image`);
      
      if (error.value || !data.value) {
        throw new Error(`Gagal mengambil detail artikel: ${id}`);
      }

      const raw = data.value as any;
      const item = raw.data;
      
      // Logika transformasi untuk satu item
      const mediaId = item.relationships?.field_media_image?.data?.id;
      const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);
      const fileId = mediaItem?.relationships?.field_media_image?.data?.id;
      const fileItem = raw.included?.find((inc: any) => inc.id === fileId);
      
      const imageUrl = fileItem?.attributes?.uri?.url 
        ? `${drupalBaseUrl}${fileItem.attributes.uri.url}` 
        : null;

      return {
        id: item.id,
        title: item.attributes.title,
        content: item.attributes.body?.value || '', // Sesuaikan field content
        image: imageUrl,
        path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`
      };
    }
  };
};