import type { ArticleModel } from '../model/ArticleModel';

export interface IArticle {
  getArticles(): Promise<ArticleModel[]>;
  getArticleById(id: string): Promise<ArticleModel>;
  getArticlesByTag(tagId: string): Promise<ArticleModel[]>;
}