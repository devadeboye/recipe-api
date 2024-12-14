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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/enums/env.configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { envValidationSchema } from './config/validators/env.validation';
import { TokenMiddleware } from './utils/middlewares/token.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { FavouriteModule } from './favourite/favourite.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(EnvConfiguration.CONNECTION_STRING),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      validationSchema: envValidationSchema,
      envFilePath: ['.env'],
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
        {
          path: 'login',
          method: RequestMethod.POST,
        },
        {
          path: 'signup',
          method: RequestMethod.POST,
        },
        {
          path: 'recipes',
          method: RequestMethod.GET,
        },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
