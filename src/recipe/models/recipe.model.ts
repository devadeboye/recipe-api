import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { mongooseSchemaConfig } from 'src/utils/database/schema.config';
import { IRecipe } from '../interfaces/recipe.interface';
import { DishTypeEnum } from '../enums/recipe.enum';
import { Ingredient } from './ingredient.model';

@Schema(mongooseSchemaConfig)
export class Recipe implements IRecipe {
  @Prop()
  public id: number;

  @Prop()
  public title: string;

  @Prop()
  public calories: number;

  @Prop()
  public carbs: string;

  @Prop()
  public fat: string;

  @Prop()
  public image: string;

  @Prop()
  public imageType: string;

  @Prop()
  public protein: string;

  @Prop()
  public servings?: number;

  @Prop()
  public readyInMinutes?: number;

  @Prop()
  public license?: string;

  @Prop()
  public sourceName?: string;

  @Prop()
  public sourceUrl?: string;

  @Prop()
  public spoonacularSourceUrl?: string;

  @Prop()
  public healthScore?: number;

  @Prop()
  public spoonacularScore?: number;

  @Prop()
  public pricePerServing?: number;

  @Prop()
  public cheap?: boolean;

  @Prop()
  public dairyFree?: boolean;

  @Prop()
  public glutenFree?: boolean;

  @Prop()
  public ketogenic?: boolean;

  @Prop()
  public sustainable?: boolean;

  @Prop()
  public vegan?: boolean;

  @Prop()
  public vegetarian?: boolean;

  @Prop()
  public veryHealthy?: boolean;

  @Prop()
  public veryPopular?: boolean;

  @Prop({ type: String, enum: DishTypeEnum })
  public dishTypes?: DishTypeEnum[];

  @Prop({ type: Ingredient })
  public extendedIngredients?: Ingredient[];

  @Prop()
  public summary?: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
export type RecipeDocument = Recipe & mongoose.Document;
