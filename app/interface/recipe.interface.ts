import type { Recipe } from '../model/recipe.entity';

export interface RecipeServiceInterface {
  getRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe>;
  getRecipesByTag(tagId: string): Promise<Recipe[]>;
}