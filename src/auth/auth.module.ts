import { Module } from '@nestjs/common';
import { TokenService } from './services/token.service';

@Module({
  imports: [],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [],
})
export class AuthModule {}
