// app/core/recipe/recipe.interface.ts
import type { Recipe } from '@/model/recipe.entity';

export interface RecipeInterface {
  findAll(): Promise<Recipe[]>;
  // Tambahkan baris ini:
  findById(id: string): Promise<any>; 
}

