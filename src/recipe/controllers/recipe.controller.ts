import { Controller, Logger } from '@nestjs/common';
import { RecipeService } from '../services/recipe.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('recipe')
export class RecipeController {
  public constructor(private readonly recipeService: RecipeService) {}

  // @Cron('0 5 * * 1') // runs at 5 AM every Monday (weekly)
  @Cron(CronExpression.EVERY_5_MINUTES) // test
  public async fetchVegetarianRecipes(): Promise<void> {
    Logger.debug('about to fetch vegetarian recipes');
    await this.recipeService.fetchRecipesFromSource('diet=vegetarian');
    Logger.debug('done fetching vegetarian recipes');
  }
}
