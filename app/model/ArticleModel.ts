// app/core/article/article.entity.ts
export interface ArticleModel {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  path: string;
  date: string;
  author: string;
  tags: TagModel[],
  toc: TocItem[],
  authorAvatar?: string | null;
  description?: string | null;
  authors?: string | null;
  category: CategoryModel[];
}

export interface CategoryModel {
  id: string;
  name: string;
}

export interface TagModel {
  id: string;
  name: string;
}
export interface TocItem {
  id: string;
  text: string;
  active: boolean;
}