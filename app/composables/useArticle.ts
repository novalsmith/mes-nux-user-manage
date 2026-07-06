// app/composables/useArticle.ts
import { useArticleService } from '../services/article.service';


export const useArticle = async () => {
const service = useArticleService();
  const articles = await service.getArticles();
  return { articles };
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