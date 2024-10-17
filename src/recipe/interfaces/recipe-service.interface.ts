import { RecipeInformation } from './recipe.interface';

export interface IRecipeService {
  fetchRecipesFromSource(query: string): Promise<void>;

  getRecipeInformation(): Promise<RecipeInformation>;
}
