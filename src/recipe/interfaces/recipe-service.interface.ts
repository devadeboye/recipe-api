import { FetchRecipesResponse, RecipeInformation } from './recipe.interface';

export interface IRecipeService {
  fetchRecipes(): Promise<FetchRecipesResponse>;

  getRecipeInformation(): Promise<RecipeInformation>;
}
