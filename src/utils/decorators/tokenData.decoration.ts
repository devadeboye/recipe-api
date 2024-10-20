import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Response } from 'express';
import { TokenDto } from 'src/auth/dtos/token.dto';

export const TokenDataDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response: Response = ctx.switchToHttp().getResponse();
    return response.locals.tokenData as TokenDto;
  },
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseToken = () => SetMetadata('token', true);
