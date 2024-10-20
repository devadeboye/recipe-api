export interface IRecipeService {
  fetchRecipesFromSource(query: string): Promise<void>;

  fetchRecipeInformationFromSource(recipeId: number): Promise<void>;
}
