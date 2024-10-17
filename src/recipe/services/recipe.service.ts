import { Injectable } from '@nestjs/common';
import { IRecipeService } from '../interfaces/recipe-service.interface';
import { RecipeInformation } from '../interfaces/recipe.interface';
import { SpoonacularService } from './spoonacular/spoonacular.service';
import { Recipe } from '../models/recipe.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RecipeService implements IRecipeService {
  public constructor(
    private readonly spoonacularService: SpoonacularService,
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<Recipe>,
  ) {}

  public async fetchRecipesFromSource(query: string): Promise<void> {
    const recipes = await this.spoonacularService.fetchRecipes(query);
    await this.recipeModel.insertMany(
      recipes.map(
        (recipe) => new this.recipeModel({ ...recipe, _id: recipe.id }),
      ),
      { ordered: false }, // Allows continuing if duplicates exist
    );
  }

  public async getRecipeInformation(): Promise<RecipeInformation> {
    throw new Error('Method not implemented.');
  }
}
