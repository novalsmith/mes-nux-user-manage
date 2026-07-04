// app/core/article/article.entity.ts
export interface Article {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  path: string;
  tags: Tag[]
}

export interface Tag {
  id: string;
  name: string;
}