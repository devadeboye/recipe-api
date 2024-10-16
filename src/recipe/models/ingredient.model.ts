import { IIngredient } from '../interfaces/recipe.interface';

export class Ingredient implements IIngredient {
  public aisle: string;
  public amount: number;
  public consitency: string;
  public id: number;
  public image: string;
  public measures: {
    metric: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
    us: { amount: number; unitLong: string; unitShort: string };
  };
  public meta: string[];
  public name: string;
  public original: string;
  public originalName: string;
  public unit: string;
}
