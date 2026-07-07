import type { Recipe } from '../model/RecipeModel';

export interface IRecipe {
  getRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe>;
  getRecipesByTag(tagId: string): Promise<Recipe[]>;
}