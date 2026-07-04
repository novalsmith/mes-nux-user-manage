// app/composables/useRecipe.ts
import { useRecipeService } from "~~/services/recipe.service";

export const useRecipes = async () => {
  const service = useRecipeService();
  
  const [recipes] = await Promise.all([
    service.getRecipes()
  ]);
  
  return { recipes };
}; 


export const useRecipeDetail = (id: string) => {
  const config = useRuntimeConfig();
  const service = useRecipeService();

  const { data, pending, error } = useAsyncData(`recipe-${id}`, async () => {
    const raw: any = await service.getRecipeById(id);

    // Logika transformasi (dipindahkan dari komponen ke sini)
    const item = raw.data;
    const mediaId = item.relationships?.field_media_image?.data?.id;
    const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);
    const fileId = mediaItem?.relationships?.field_media_image?.data?.id;
    const fileItem = raw.included?.find((inc: any) => inc.id === fileId);
    
    const drupalBaseUrl = 'http://localhost:8080';
      const imageUrl = fileItem?.attributes?.uri?.url 
        ? `${drupalBaseUrl}${fileItem.attributes.uri.url}` 
        : null;

    return {
      title: item.attributes.title,
      body: item.attributes.field_recipe_instruction?.processed,
      image: imageUrl,
    };
  });

  return { recipe: data, pending, error };
};