// infrastructure/api/article.api.ts
import type { ArticleRepository } from '~/repository/article.repository';
import type { Article } from '~/model/article.entity';

export const useArticleApi = (): ArticleRepository => {
  const config = useRuntimeConfig();
    const drupalBaseUrl = config.public.drupalBaseUrl;

  return {
          async findAll(type: 'article' | 'recipe' = 'article'): Promise<Article[]> {
            // Bangun URL secara manual untuk menghindari masalah encoding query
            const baseUrl = `${drupalBaseUrl}/${type}`;
            const includeParams = 'include=field_media_image,field_media_image.field_media_image,field_tags';
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

                const tags = item.relationships?.field_tags?.data?.map((tagRef: any) => {
                    const tagItem = raw.included?.find((inc: any) => inc.id === tagRef.id);
                    return { id: tagRef.id, name: tagItem?.attributes?.name };
                }) || [];

            return {
                id: item.id,
                title: item.attributes.title,
                image: imageUrl,
                tags: tags,
                path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`
              };
          });
        },

        async findById(id: string): Promise<Article> {
      const { data, error } = await useFetch(`${drupalBaseUrl}/article/${id}?include=field_media_image,field_media_image.field_media_image,field_tags`);
      
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
        path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`,
        tags: item.relationships?.field_tags?.data?.map((tagRef: any) => {
          const tagItem = raw.included?.find((inc: any) => inc.id === tagRef.id);
          return { id: tagRef.id, name: tagItem?.attributes?.name };
        }) || []
      };
    },
 

      async findByTag(tagId: string): Promise<Article[]> {
            // Bangun URL secara manual untuk menghindari masalah encoding query
            const url = `${drupalBaseUrl}/article?filter[field_tags.id]=${tagId}&include=field_media_image,field_media_image.field_media_image,field_tags`;
            
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

                const tags = item.relationships?.field_tags?.data?.map((tagRef: any) => {
                    const tagItem = raw.included?.find((inc: any) => inc.id === tagRef.id);
                    return { id: tagRef.id, name: tagItem?.attributes?.name };
                }) || [];

            return {
                id: item.id,
                title: item.attributes.title,
                image: imageUrl,
                tags: tags,
                path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`
              };
          });
        },

  };
};