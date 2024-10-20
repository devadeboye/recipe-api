import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { mongooseSchemaConfig } from 'src/utils/database/schema.config';
import { User } from 'src/user/models/user.model';
import { Recipe } from '../../recipe/models/recipe.model';
import { IFavourite } from '../interfaces/favourite.interface';

@Schema(mongooseSchemaConfig)
export class Favourite implements IFavourite {
  public id: number;

  @Prop({ ref: User.name, type: mongoose.Schema.Types.ObjectId })
  public user: string;

  @Prop({ ref: Recipe.name, type: Number })
  public recipe: number;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
export type FavouriteDocument = Favourite & mongoose.Document;
