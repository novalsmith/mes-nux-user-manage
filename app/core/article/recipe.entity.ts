// app/core/article/recipe.entity.ts
export interface Recipe {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  path: string;
}