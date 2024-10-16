import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './models/recipe.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Recipe.name,
        useFactory: (): unknown => {
          return RecipeSchema;
        },
      },
    ]),
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class RecipeModule {}
