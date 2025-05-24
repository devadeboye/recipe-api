import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenMiddleware } from './utils/middlewares/token.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { FavouriteModule } from './favourite/favourite.module';
import config, { readSecret } from './utils/functions/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: false,
      // validationSchema: envValidationSchema,
      // envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const connectionString = readSecret('CONNECTION_STRING');
        // const username = readSecret('MONGO_INITDB_ROOT_USERNAME');
        // const password = readSecret('MONGO_INITDB_ROOT_PASSWORD');
        // const host = 'mongo';
        // const connectionString = `mongodb://${username}:${password}@${host}:27017/recipe-db?authSource=admin`;
        // const connectionString = `mongodb://${username}:${password}@${host}/recipe-db?authSource=admin`;
        // Logger.debug(connectionString, 'MongoDB connection string');

        return { uri: connectionString };
      },
      inject: [],
    }),
    UserModule,
    RecipeModule,
    AuthModule,
    RecipeModule,
    ScheduleModule.forRoot(),
    FavouriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): unknown {
    return consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'login', method: RequestMethod.POST },
        { path: 'signup', method: RequestMethod.POST },
        { path: 'recipes', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
