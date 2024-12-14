import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { mongooseSchemaConfig } from 'src/utils/database/schema.config';
import * as mongoose from 'mongoose';
import { User } from 'src/user/models/user.model';

@Schema(mongooseSchemaConfig)
export class RefreshToken implements IRefreshToken {
  public id?: string;

  @Prop({ type: String })
  public token: string;

  @Prop({ type: String, ref: User.name })
  public userId: string;

  @Prop({ type: Date })
  public expiresAt: Date;

  @Prop({ type: Boolean })
  public isRevoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
export type RefreshTokenDocument = RefreshToken & mongoose.Document;
