import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/auth/services/token/token.service';
import { TokenDto } from 'src/auth/dtos/token.dto';
import { AccountStatusEnum } from 'src/user/enums/accountStatus.enum';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  public constructor(private readonly tokenService: TokenService) {}
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (!req.headers.authorization) {
      return next();
    }
    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer') {
      throw new NotFoundException('please provide a Bearer token');
    }

    if (!token) {
      throw new Notification('token not found');
    }
    const tokenData: TokenDto = await this.tokenService.verify(token);

    if (tokenData.accountStatus === AccountStatusEnum.Suspended) {
      throw new BadRequestException(
        'your account is suspended, kindly reach out to your administrator for instructions on reactivating your account',
      );
    }
    res.locals.tokenData = tokenData;
    next();
  }
}
