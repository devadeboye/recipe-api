import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { JoiObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  UserLoginDto,
  UserSearchFilterDto,
} from '../dtos/user.dto';
import { UserService } from '../services/user.service';
import { TokenService } from 'src/auth/services/token/token.service';
import { TokenDataDecorator } from 'src/utils/decorators/tokenData.decoration';
import { TokenDto } from 'src/auth/dtos/token.dto';
import {
  loginValidator,
  signupValidator,
  userSearchValidator,
} from '../validators/user.validator';
import { User, UserDocument } from '../models/user.model';
import { SignUpPipe } from '../pipes/user.pipe';
import { RefreshTokenService } from 'src/auth/services/refresh-token/refresh-token.service';

@Controller('user')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('signup')
  public async signup(
    @Body(new JoiObjectValidationPipe(signupValidator), SignUpPipe)
    signupDetails: User,
  ): Promise<Omit<User, 'password' | 'salt'> & { authorizationToken: string }> {
    const user = await this.userService.create(signupDetails);
    const { authorizationToken } = await this.tokenService.generateTokens(user);
    return { ...user, authorizationToken };
  }

  @Post('login')
  public async login(
    @Body(new JoiObjectValidationPipe(loginValidator))
    userLoginDetails: UserLoginDto,
  ): Promise<Omit<User, 'password' | 'salt'> & { authorizationToken: string }> {
    const user = (
      await this.userService.login(userLoginDetails)
    )?.toJSON() as User;
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    const { authorizationToken } = await this.tokenService.generateTokens(user);
    return { ...user, authorizationToken };
  }

  @Get('search')
  public async search(
    @TokenDataDecorator() tokenData: TokenDto,
    @Query(new JoiObjectValidationPipe(userSearchValidator))
    searchFilter: UserSearchFilterDto,
  ): Promise<{
    count: number;
    totalPages: number;
    currentPage: number;
    users: UserDocument[];
  }> {
    return await this.userService.search(searchFilter, []);
  }

  @Post('refresh-token')
  public async refreshToken(
    @Body() data: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = data;
    const tokenRecord =
      await this.refreshTokenService.fetchRefreshToken(refreshToken);
    if (
      !tokenRecord ||
      tokenRecord.isRevoked ||
      new Date() > tokenRecord.expiresAt
    ) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const user = await this.userService.findById(tokenRecord.userId);
    // generate a new access token
    const { authorizationToken } = await this.tokenService.generateTokens(user);
    return { authorizationToken, refreshToken };
  }
}
