// app/implementation/article.api.ts
import type { ArticleRepository } from '../repository/ArticleRepository';

export const useArticleApi = (): ArticleRepository => {
  const jsonPath = '/api/drupal/jsonapi/node';

  // 1. Definisikan include default yang selalu dibutuhkan oleh aplikasi
  const defaultIncludes = [
    'field_media_image',
    'field_media_image.field_media_image',
    'field_tags',
    'uid'
  ];

  // 2. Helper function untuk membangun string include secara dinamis
  const getIncludeQuery = (customIncludes?: string[]): string => {
    // Jika ada customIncludes, gabungkan dengan default. Jika tidak, pakai default saja.
    const combined = customIncludes 
      ? [...new Set([...defaultIncludes, ...customIncludes])] // Set untuk mencegah duplikasi
      : defaultIncludes;
    
    return combined.join(',');
  };

  return {
    // Anda bisa menambahkan parameter opsional `customIncludes` jika dibutuhkan nanti
    async findAll(customIncludes?: string[]): Promise<any> {
      const includeString = getIncludeQuery(customIncludes);
      const url = `${jsonPath}/article?include=${includeString}`;
      
      return await $fetch<any>(url).catch(() => null);
    },

    async findById(id: string, customIncludes?: string[]): Promise<any> {
      const includeString = getIncludeQuery(customIncludes);
      const url = `${jsonPath}/article/${id}?include=${includeString}`;

      return await $fetch<any>(url).catch(() => null);
    },

    async findByTag(tagId: string, customIncludes?: string[]): Promise<any> {
      const includeString = getIncludeQuery(customIncludes);
      const url = `${jsonPath}/article?filter[field_tags.id]=${tagId}&include=${includeString}`;

      return await $fetch<any>(url).catch(() => null);
    }
  };
};