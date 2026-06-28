// infrastructure/api/article.api.ts
import type { ArticleRepository } from '@/core/article/article.repository';
import type { Article } from '@/core/article/article.entity';

export const useArticleApi = (): ArticleRepository => {
  const config = useRuntimeConfig();
  
  return {
async findAll(type: 'article' | 'recipe' = 'article'): Promise<Article[]> {
  // Bangun URL secara manual untuk menghindari masalah encoding query
  const baseUrl = `/api/drupal/node/${type}`;
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
  // 1. Cari objek media di 'included'
const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);  
  // 2. Cari ID file dari relasi media (biasanya field_media_image)
const fileId = mediaItem?.relationships?.field_media_image?.data?.id;  
  // 3. Cari objek file di 'included'
const fileItem = raw.included?.find((inc: any) => inc.id === fileId);  
  // 4. Ambil URL
  const drupalBaseUrl = 'http://localhost:8080';
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
    }
  };
};