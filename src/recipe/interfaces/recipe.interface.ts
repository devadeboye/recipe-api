import { DishTypeEnum } from '../enums/recipe.enum';

export interface IRecipe {
  id: number;
  title: string;
  calories: number;
  carbs: string;
  fat: string;
  image: string;
  imageType: string;
  protein: string;

  servings?: number;
  readyInMinutes?: number;
  license?: string;
  sourceName?: string;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  healthScore?: number;
  spoonacularScore?: number;
  pricePerServing?: number;
  cheap?: boolean;
  dairyFree?: boolean;
  glutenFree?: boolean;
  ketogenic?: boolean;
  sustainable?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  veryHealthy?: boolean;
  veryPopular?: boolean;
  dishTypes?: DishTypeEnum[];
  extendedIngredients?: IIngredient[];
  summary?: string;
}

export interface IIngredient {
  aisle: string;
  amount: number;
  consitency: string;
  id: number;
  image: string;
  measures: {
    metric: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
    us: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
  };
  meta: string[];
  name: string;
  original: string;
  originalName: string;
  unit: string;
}
