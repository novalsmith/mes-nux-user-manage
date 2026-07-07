// app/services/article.service.ts
import { useArticleApi } from '../implementation/ArticleApi';
import type { IArticle } from '../interface/IArticle';
import type { ArticleModel } from '../model/ArticleModel';

export const useArticleService = (): IArticle => {
  const api = useArticleApi();
  const config = useRuntimeConfig();
  const drupalBaseUrl = config.public.drupalBaseUrl;
 
  // LOGIKA TRANSFORMATION / MAPPER (Pindahan dari API ke Service)
  const mapRawToArticle = (item: any, included: any[] = []): ArticleModel => {
    // 1. Ambil Image URL sesuai logic original dari Drupal JSON:API
    const mediaId = item.relationships?.field_media_image?.data?.id;  
    const mediaItem = included?.find((inc: any) => inc.id === mediaId);  
    const fileId = mediaItem?.relationships?.field_media_image?.data?.id;  
    const fileItem = included?.find((inc: any) => inc.id === fileId);  
    
    const imageUrl = fileItem?.attributes?.uri?.url 
      ? `${drupalBaseUrl}${fileItem.attributes.uri.url}` 
      : null;

    // 2. Ambil List Tags
    const tags = item.relationships?.field_tags?.data?.map((tagRef: any) => {
      const tagItem = included?.find((inc: any) => inc.id === tagRef.id);
      return { id: tagRef.id, name: tagItem?.attributes?.name || 'Tag' };
    }) || [];

    // 3. Ambil Nama Author dari Array Included
    const authorId = item.relationships?.uid?.data?.id;
    const authorItem = included?.find((inc: any) => inc.id === authorId);
    // Menggunakan fallback jika display_name / name tidak ditemukan
    const authorName = authorItem?.attributes?.display_name || authorItem?.attributes?.name || 'Admin';

    // 4. Format Tanggal Posting (Format Indonesia: DD MMMM YYYY)
    const rawDate = item.attributes.created;
    const formattedDate = rawDate 
      ? new Date(rawDate).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';

    // 5. Kembalikan objek bersih yang siap dipakai UI komponen
    return {
      id: item.id,
      title: item.attributes.title,
      content: item.attributes.body?.value || item.attributes.field_body?.processed || '',
      image: imageUrl,  
      tags: tags,
      date: formattedDate,
      author: authorName,
      path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`
    };
  };

  return {
    async getArticles(): Promise<ArticleModel[]> {
      const raw = await api.findAll();
      if (!raw || !raw.data) return [];
      
      return raw.data.map((item: any) => mapRawToArticle(item, raw.included));
    },

    async getArticleById(id: string): Promise<ArticleModel> {
      const raw = await api.findById(id);
      if (!raw || !raw.data) {
        throw new Error(`Data artikel tidak ditemukan untuk ID: ${id}`);
      }
      
      return mapRawToArticle(raw.data, raw.included);
    },

    async getArticlesByTag(tagId: string): Promise<ArticleModel[]> {
      const raw = await api.findByTag(tagId);
      if (!raw || !raw.data) return [];

      return raw.data.map((item: any) => mapRawToArticle(item, raw.included));
    }
  };
};