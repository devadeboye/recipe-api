import { Injectable, Logger } from '@nestjs/common';
import { Favourite, FavouriteDocument } from '../models/favourite.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FavouriteService {
  public constructor(
    @InjectModel(Favourite.name)
    private readonly recipeModel: Model<Favourite>,
  ) {}

  public async addFavourite(
    user: string,
    recipe: string,
  ): Promise<FavouriteDocument> {
    try {
      const exists = await this.recipeModel
        .findOneAndDelete({ user, recipe })
        .populate([{ path: 'user', select: ['-password'] }, 'recipe']);

      if (!exists) {
        const favourite = (
          await this.recipeModel.create({ user, recipe })
        ).populate([{ path: 'user', select: ['-password'] }, 'recipe']);
        return favourite;
      }
      return exists;
    } catch (err) {
      Logger.error(err);
      throw err;
    }

    // const favourite = (
    //   await this.recipeModel.create({ user, recipe })
    // ).populate([{ path: 'user', select: ['-password'] }, 'recipe']);
    // return favourite;
  }

  public async fetchFavourites(user: string): Promise<FavouriteDocument[]> {
    return this.recipeModel
      .find({ user })
      .populate([{ path: 'user', select: ['-password'] }, 'recipe']);
  }
}
