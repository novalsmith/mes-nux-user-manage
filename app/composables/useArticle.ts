// app/composables/useArticle.ts
import { useArticleService } from '../services/ArticleService';

 
export const useArticle = () => {
  const service = useArticleService();
  const { data: articles, pending, error } = useAsyncData('articles-list', () => 
    service.getArticles()
  );
  return { articles, pending, error };
};

export const useArticleDetail = (id: string) => {
  const service = useArticleService();
  const { data: article, pending, error } = useAsyncData(`article-${id}`, () => 
    service.getArticleById(id)
  );

  return { article, pending, error };
};

export const getArticlesByTag = (id: string) => {
  const service = useArticleService();
  const { data: articles, pending, error } = useAsyncData(`articles-tag-${id}`, () => 
    service.getArticlesByTag(id)
  );

  return { articles, pending, error };
};

export const useArticleSearch = (keyword: Ref<string>) => {
  const service = useArticleService();

  const { data: articles, pending, error, refresh } = useAsyncData(
    // Menggunakan watch agar jika value keyword berubah, useAsyncData otomatis running ulang
    `articles-search`,
    () => service.searchArticlesByTitle(keyword.value),
    { watch: [keyword] }
  );

  return { articles, pending, error, refresh };
};