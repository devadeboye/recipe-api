import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { IRefreshTokenService } from 'src/auth/interfaces/refresh-token.interface';
import { RefreshToken } from 'src/auth/models/refresh-token.model';
import { randomBytes } from 'crypto';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  public constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}
  public generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  public async saveRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // expiration in 30 days
    const token = await this.refreshTokenModel.create({
      token: refreshToken,
      userId,
      isRevoked: false,
      expiresAt,
    });
    return token;
  }

  public async update(
    id: string,
    update: UpdateQuery<RefreshToken>,
  ): Promise<UpdateWriteOpResult> {
    return this.refreshTokenModel.updateOne({ _id: id }, update);
  }

  public async fetchRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ token });
  }

  public async setRefreshToken(userId: string): Promise<RefreshToken> {
    const token = this.generateRefreshToken();
    const tokenRecord = await this.saveRefreshToken(token, userId);
    return tokenRecord;
  }

  public async revokeRefreshToken(tokenRecord: RefreshToken): Promise<void> {
    tokenRecord.isRevoked = true;
    await this.update(tokenRecord.id!, tokenRecord);
  }
}
