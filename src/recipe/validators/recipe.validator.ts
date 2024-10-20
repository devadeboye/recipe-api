import * as Joi from 'joi';
import { RecipeSearchDto } from '../dtos/recipe.dto';

export const recipeSearchValidator = Joi.object<RecipeSearchDto>({
  cheap: Joi.boolean().default(null),
  dairyFree: Joi.boolean().default(null),
  glutenFree: Joi.boolean().default(null),
  ketogenic: Joi.boolean().default(null),
  vegan: Joi.boolean().default(null),
  vegetarian: Joi.boolean().default(null),
  veryHealthy: Joi.boolean().default(null),
  veryPopular: Joi.boolean().default(null),
  page: Joi.number().greater(0).default(1),
  limit: Joi.number().greater(0).default(20),
});
