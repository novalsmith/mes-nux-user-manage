// app/core/article/article.entity.ts
export interface ArticleModel {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  path: string;
  date: string;
  author: string;
  tags: TagModel[]
}

export interface TagModel {
  id: string;
  name: string;
}