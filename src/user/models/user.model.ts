import { mongooseSchemaConfig } from 'src/utils/database/schema.config';
import { IUser } from '../interfaces/user.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { AccountStatusEnum } from '../enums/accountStatus.enum';
import * as mongoose from 'mongoose';

@Schema(mongooseSchemaConfig)
export class User implements IUser {
  public id?: string | undefined;

  @Prop({ type: String })
  public username: string;

  @Prop({ type: String, default: AccountStatusEnum.Active })
  public accountStatus: AccountStatusEnum;

  @Prop()
  public password?: string;

  public static async isValidPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (e) {
      Logger.error(e.message);
      throw new InternalServerErrorException(e.message);
    }
  }

  public static async hashPassword(pass: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(pass, salt);
      Logger.debug(`Hash password: ${password}`);
      return password;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & mongoose.Document;
