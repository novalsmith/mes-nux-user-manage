// app/composables/useArticleDetail.ts
import { useArticleService } from "~~/services/article.service";


export const useArticleDetail = (id: string) => {
  const config = useRuntimeConfig();
  const service = useArticleService();

  const { data, pending, error } = useAsyncData(`article-${id}`, async () => {
    const raw: any = await service.getArticleById(id);
    
    // Logika transformasi (dipindahkan dari komponen ke sini)
    const item = raw.data;
    const mediaId = item.relationships?.field_media_image?.data?.id;
    const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);
    const fileId = mediaItem?.relationships?.field_media_image?.data?.id;
    const fileItem = raw.included?.find((inc: any) => inc.id === fileId);
    
    return {
      title: item.attributes.title,
      body: item.attributes.field_body?.processed,
      image: fileItem ? `${config.public.apiBase.replace('/jsonapi', '')}${fileItem.attributes.uri.url}` : null
    };
  });

  return { article: data, pending, error };
};