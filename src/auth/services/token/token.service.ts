import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfiguration } from 'src/config/enums/env.configuration';
import * as jwt from 'jsonwebtoken';
import { TokenDto } from '../../dtos/token.dto';
import { User } from 'src/user/models/user.model';
import { VerifyErrors } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  public constructor(private config: ConfigService) {}

  public tokenize({
    data,
    expiresIn = this.config.get<number>(EnvConfiguration.JWT_LIFESPAN)!,
  }: {
    data: TokenDto;
    expiresIn: number;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get<string>(
        EnvConfiguration.TOKEN_SECRET,
      )!;
      jwt.sign(data, tokenSecret, { expiresIn }, (err, decoded: string) => {
        if (err) {
          reject(new InternalServerErrorException(err));
        }
        resolve(decoded);
      });
    });
  }

  public verify(token: string): Promise<TokenDto> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get<string>(
        EnvConfiguration.TOKEN_SECRET,
      )!;
      jwt.verify(
        token,
        tokenSecret,
        (err: VerifyErrors | null, decoded: TokenDto) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              throw new UnauthorizedException('Token has expired');
            }
            reject(new UnauthorizedException(err));
          }
          resolve(decoded);
        },
      );
    });
  }

  public decode(token: string): jwt.Jwt | null {
    return jwt.decode(token, { complete: true });
  }

  /** function that abstract generation of jwt */
  public async generateTokens(
    user: User,
  ): Promise<{ authorizationToken: string }> {
    // generate jwt
    const authorizationToken = await this.tokenize({
      data: {
        username: user.username,
        accountStatus: user.accountStatus!,
        id: user.id!,
      },
      expiresIn: this.config.get<number>(EnvConfiguration.JWT_LIFESPAN)!,
    });

    return { authorizationToken };
  }
}
