// infrastructure/api/article.api.ts
import type { ArticleRepository } from '@/core/article/article.repository';
import type { Article } from '@/core/article/article.entity';

export const useArticleApi = (): ArticleRepository => {
  const config = useRuntimeConfig();
  
  return {
    async findAll(type: 'article' | 'recipe' = 'article'): Promise<Article[]> {
      // 1. Perbaiki parameter include menjadi field_media_image
       const url = `${config.public.apiBase}/node/${type}?include=field_media_image,field_media_image.field_media_image`;
      const { data } = await useFetch(url);
      
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
  const imageUrl = fileItem?.attributes?.uri?.url 
    ? `${config.public.apiBase.replace('/jsonapi', '')}${fileItem.attributes.uri.url}` 
    : null;

  return {
    id: item.id,
    title: item.attributes.title,
    image: imageUrl // Sekarang ini akan berisi URL asli, bukan null
  };
});
    }
  };
};