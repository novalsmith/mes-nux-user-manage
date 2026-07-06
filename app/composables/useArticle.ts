// app/composables/useArticle.ts
import { useArticleService } from "~~/services/article.service";

const config = useRuntimeConfig();
const drupalBaseUrl = config.public.drupalBaseUrl;

export const useArticle = async () => {
  const service = useArticleService();
  
  const [articles] = await Promise.all([
    service.getArticles("article"),
  ]);
  
  return { articles };
}; 

export const useArticleDetail = (id: string) => {
  
  const service = useArticleService();

  const { data, pending, error } = useAsyncData(`article-${id}`, async () => {
    const raw: any = await service.getArticleById(id);
    
    // Logika transformasi (dipindahkan dari komponen ke sini)
    const item = raw.data;
    const mediaId = item.relationships?.field_media_image?.data?.id;
    const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);
    const fileId = mediaItem?.relationships?.field_media_image?.data?.id;
    const fileItem = raw.included?.find((inc: any) => inc.id === fileId);
    
    const imageUrl = fileItem?.attributes?.uri?.url 
        ? `${drupalBaseUrl}${fileItem.attributes.uri.url}` 
        : null;

    return {
      title: item.attributes.title,
      body: item.attributes.field_body?.processed,
      image: imageUrl,
      tags: item.relationships?.field_tags?.data?.map((tagRef: any) => {
        const tagItem = raw.included?.find((inc: any) => inc.id === tagRef.id);
        return { id: tagRef.id, name: tagItem?.attributes?.name };
      }) || []
    };
  });

  return { article: data, pending, error };
};

export const getArticlesByTag = (id: string) => {
  const config = useRuntimeConfig();
  const service = useArticleService();

  // Ubah key nama agar lebih representatif: articles bukan tags
  const { data: articles, pending, error } = useAsyncData(`articles-tag-${id}`, async () => {
    const raw: any = await service.getTagById(id);
    
    // Pastikan raw.data ada dan berbentuk array
    if (!raw || !raw.data) return [];

    // Lakukan mapping karena data berupa Array []
    return raw.data.map((item: any) => {
      // 1. Ambil Image URL dari included (jika field_media_image di-include)
      const mediaId = item.relationships?.field_media_image?.data?.id;
      const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);
      // Tergantung struktur include Drupal Anda, biasanya berelasi ke file entity
      const fileId = mediaItem?.relationships?.field_media_image?.data?.id;
      const fileItem = raw.included?.find((inc: any) => inc.id === fileId);
      
      const imageUrl = fileItem?.attributes?.uri?.url 
        ? `${drupalBaseUrl}${fileItem.attributes.uri.url}` 
        : null;

      // 2. Ambil List Tags Nama dari included
      const tagsList = item.relationships?.field_tags?.data?.map((tagRef: any) => {
        const tagItem = raw.included?.find((inc: any) => inc.id === tagRef.id);
        return { id: tagRef.id, name: tagItem?.attributes?.name || 'Tag' };
      }) || [];

      // Kembalikan objek bersih untuk tiap artikel
      return {
        id: item.id,
        title: item.attributes.title,
        body: item.attributes.field_body?.processed,
        path: item.attributes.path?.alias || '#',
        image: imageUrl,
        tags: tagsList
      };
    });
  });

  return { articles, pending, error };
};