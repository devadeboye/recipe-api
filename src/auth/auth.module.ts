import { Module } from '@nestjs/common';
import { TokenService } from './services/token/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './models/refresh-token.model';
import { RefreshTokenService } from './services/refresh-token/refresh-token.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: RefreshToken.name,
        useFactory: (): unknown => {
          return RefreshTokenSchema;
        },
      },
    ]),
  ],
  providers: [TokenService, RefreshTokenService],
  exports: [TokenService, RefreshTokenService],
  controllers: [],
})
export class AuthModule {}
