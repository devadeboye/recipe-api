import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './models/recipe.model';
import { RecipeService } from './services/recipe.service';
import { SpoonacularService } from './services/spoonacular/spoonacular.service';
import { HttpModule } from '@nestjs/axios';
import { RecipeController } from './controllers/recipe.controller';

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
    HttpModule,
  ],
  providers: [RecipeService, SpoonacularService],
  exports: [],
  controllers: [RecipeController],
})
export class RecipeModule {}
