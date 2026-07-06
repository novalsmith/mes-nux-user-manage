// app/repository/recipe.repository.ts
export interface RecipeRepository {
  findAll(): Promise<any>;
  findById(id: string): Promise<any>;
  findByTag(tagId: string): Promise<any>;
}