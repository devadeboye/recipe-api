import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IRecipeService } from '../interfaces/recipe-service.interface';
import { SpoonacularService } from './spoonacular/spoonacular.service';
import { Recipe, RecipeDocument } from '../models/recipe.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RecipeSearchDto } from '../dtos/recipe.dto';
import { SearchResult } from 'src/utils/dtos/search.dto';

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

  public async search(
    searchData: RecipeSearchDto,
  ): Promise<SearchResult<RecipeDocument[]>> {
    const { page, limit } = searchData;
    const filter: FilterQuery<Recipe> = {};

    if (searchData.cheap) {
      filter.cheap = searchData.cheap;
    }
    if (searchData.dairyFree) {
      filter.dairyFree = searchData.dairyFree;
    }
    if (searchData.glutenFree) {
      filter.glutenFree = searchData.glutenFree;
    }
    if (searchData.ketogenic) {
      filter.ketogenic = searchData.ketogenic;
    }
    if (searchData.vegan) {
      filter.vegan = searchData.vegan;
    }
    if (searchData.vegetarian) {
      filter.vegetarian = searchData.vegetarian;
    }
    if (searchData.veryHealthy) {
      filter.veryHealthy = searchData.veryHealthy;
    }
    if (searchData.veryPopular) {
      filter.veryPopular = searchData.veryPopular;
    }

    const foundItems = await this.recipeModel
      .find({ detailsFetched: true, ...filter })
      .skip((page - 1) * limit)
      .sort({
        createdAt: -1,
      })
      .limit(limit);

    const total = await this.recipeModel.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);
    const nextPage =
      total > limit ? (page < totalPages ? page + 1 : null) : null;

    return {
      limit,
      nextPage,
      totalPages,
      currentPage: `page ${page} of ${totalPages}`,
      foundItems,
    };
  }
}
