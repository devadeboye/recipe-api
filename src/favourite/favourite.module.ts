import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Favourite, FavouriteSchema } from './models/favourite.model';
import { FavouriteService } from './services/favourite.service';
import { FavouriteController } from './controllers/favourite.controller';

@Module({
  providers: [FavouriteService],
  controllers: [FavouriteController],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Favourite.name,
        useFactory: (): unknown => {
          return FavouriteSchema;
        },
      },
    ]),
  ],
})
export class FavouriteModule {}
