// app/composables/useRecipe.ts
import { useRecipeService } from '../services/recipe.service';


export const useRecipes = async () => {
const service = useRecipeService();
  const recipes = await service.getRecipes();
  return { recipes };
}; 

export const useRecipeDetail = (id: string) => {
  const service = useRecipeService();
  const { data: recipe, pending, error } = useAsyncData(`recipe-${id}`, () => 
    service.getRecipeById(id)
  );

  return { recipe, pending, error };
};

export const getRecipesByTag = (id: string) => {
  const service = useRecipeService();
  const { data: recipes, pending, error } = useAsyncData(`recipes-tag-${id}`, () => 
    service.getRecipesByTag(id)
  );

  return { recipes, pending, error };
};