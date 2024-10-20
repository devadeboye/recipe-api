import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IRecipeService } from '../interfaces/recipe-service.interface';
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
    try {
      const response = await this.spoonacularService.fetchRecipes(query);
      const recipeToCreate = response.results.map(
        (recipe) =>
          new this.recipeModel({
            ...recipe,
            _id: recipe.id,
            detailsFetched: false,
          }),
      );
      Logger.debug(recipeToCreate, 'recipeToCreate');
      await this.recipeModel.insertMany(
        recipeToCreate,
        { ordered: false }, // Allows continuing if duplicates exist
      );
    } catch (e) {
      Logger.error(e.message);
      throw e;
    }
  }

  public async fetchRecipeInformationFromSource(
    recipeId: number,
  ): Promise<void> {
    try {
      const recipe = await this.recipeModel.findById(recipeId);
      if (!recipe) {
        throw new NotFoundException('recipe not found');
      }
      const recipeInfo =
        await this.spoonacularService.fetchRecipeInformation(recipeId);
      await recipe.updateOne({ ...recipeInfo, detailsFetched: true });
      Logger.debug('recipe info fetched =============');
      // recipe = { ...recipe, ...recipeInfo };}
    } catch (e) {
      Logger.error(e.message);
      throw e;
    }
  }

  /** fetch recipes whose details are yet to be fetched from spoonacular */
  public async fetchRecipeWithNoInfo(): Promise<Recipe[]> {
    const recipes = await this.recipeModel.find({
      $or: [{ detailsFetched: false }, { detailsFetched: null }],
    });
    return recipes;
  }
}
