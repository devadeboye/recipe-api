import { Module } from '@nestjs/common';
import { User, UserSchema } from './models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: (): unknown => {
          return UserSchema;
        },
      },
    ]),
    AuthModule,
  ],
})
export class UserModule {}
