import type { Article } from '../model/article.entity';

export interface ArticleServiceInterface {
  getArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article>;
  getArticlesByTag(tagId: string): Promise<Article[]>;
}