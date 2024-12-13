import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { RecipeService } from '../services/recipe.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboundRateLimiter } from 'src/utils/services/rate-limiter.service';
import { ConfigService } from '@nestjs/config';
import { EnvConfiguration } from 'src/config/enums/env.configuration';
import { RecipeDocument } from '../models/recipe.model';
import { SearchResult } from 'src/utils/dtos/search.dto';
import { RecipeSearchDto } from '../dtos/recipe.dto';
import { JoiObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import { recipeSearchValidator } from '../validators/recipe.validator';

@Controller('recipes')
export class RecipeController {
  private rateLimiter: OutboundRateLimiter;

  public constructor(
    private readonly recipeService: RecipeService,
    private readonly configService: ConfigService,
  ) {
    const [callRate, duration] = this.configService
      .get<string>(EnvConfiguration.SPOONACULAR_RATE_LIMIT)!
      .split(':');
    this.rateLimiter = new OutboundRateLimiter(
      parseInt(callRate),
      parseInt(duration),
    ); // Specify the rate limit here e.g (50 calls per second)
  }

  @Cron('0 4 * * 1') // runs at 4 AM every Monday (weekly)
  // @Cron(CronExpression.EVERY_5_MINUTES) // test
  public async fetchVegetarianRecipes(): Promise<void> {
    Logger.debug('about to fetch vegetarian recipes');
    await this.recipeService.fetchRecipesFromSource('diet=vegetarian');
    Logger.debug('done fetching vegetarian recipes');
  }

  @Cron('0 5 * * 1') // runs at 5 AM every Monday (weekly)
  public async veganRecipes(): Promise<void> {
    Logger.debug('about to fetch vegan recipes');
    await this.recipeService.fetchRecipesFromSource('diet=vegan');
    Logger.debug('done fetching vegan recipes');
  }

  @Cron('0 6 * * 1') // runs at 6 AM every Monday (weekly)
  // @Cron(CronExpression.EVERY_5_MINUTES) // test
  public async ketogenicRecipes(): Promise<void> {
    Logger.debug('about to fetch ketogenic recipes');
    await this.recipeService.fetchRecipesFromSource('diet=ketogenic');
    Logger.debug('done fetching ketogenic recipes');
  }

  @Cron('0 7 * * 1') // runs at 7 AM every Monday (weekly)
  // @Cron(CronExpression.EVERY_5_MINUTES) // test
  public async paleoRecipes(): Promise<void> {
    Logger.debug('about to fetch paleo recipes');
    await this.recipeService.fetchRecipesFromSource('diet=paleo');
    Logger.debug('done fetching paleo recipes');
  }

  @Cron('0 8 * * 1') // runs at 8 AM every Monday (weekly)
  @Cron(CronExpression.EVERY_5_MINUTES) // test
  public async fetchRecipeDetailsFromSource(): Promise<void> {
    const recipesWithNoDetails =
      await this.recipeService.fetchRecipeWithNoInfo();

    if (recipesWithNoDetails.length < 1) {
      return;
    }

    for (const recipe of recipesWithNoDetails) {
      await this.rateLimiter.getToken<Promise<void>>(
        async (): Promise<void> => {
          return this.recipeService.fetchRecipeInformationFromSource(recipe.id);
        },
      );
    }
  }

  @Get()
  public search(
    @Query(new JoiObjectValidationPipe(recipeSearchValidator))
    payload: RecipeSearchDto,
  ): Promise<SearchResult<RecipeDocument[]>> {
    return this.recipeService.search(payload);
  }

  @Get('/:id')
  public getById(@Param('id') id: number): Promise<RecipeDocument> {
    return this.recipeService.getById(id);
  }
}
