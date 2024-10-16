import { Injectable } from '@nestjs/common';
import { IRecipeService } from '../interfaces/recipe-service.interface';
import {
  FetchRecipesResponse,
  RecipeInformation,
} from '../interfaces/recipe.interface';

@Injectable()
export class RecipeService implements IRecipeService {
  public constructor() {}

  public async fetchRecipes(): Promise<FetchRecipesResponse> {
    throw new Error('Method not implemented.');
  }

  public async getRecipeInformation(): Promise<RecipeInformation> {
    throw new Error('Method not implemented.');
  }
}
