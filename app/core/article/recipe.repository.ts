// app/core/article/article.repository.ts
import type { Recipe } from './recipe.entity';

export interface RecipeRepository {
  findAll(): Promise<Recipe[]>;
  // Tambahkan baris ini:
  findById(id: string): Promise<any>; 
}

