import { SearchFilterDto } from 'src/utils/dtos/search.dto';
import { UserSearchTopLevelFilterKey } from '../enums/user.enum';
import { User } from '../models/user.model';

export class UserLoginDto {
  public username: string;
  public password: string;
}

export class UserSearchFilterDto extends SearchFilterDto {
  public id: string[];
  public username: string[];
}

export type UserSearchTopLevelFilterDto = Record<
  UserSearchTopLevelFilterKey,
  unknown
>;

export class RefreshTokenRequestDto {
  public refreshToken: string;
}

export class RefreshTokenResponseDto {
  public refreshToken: string;
  public authorizationToken: string;
}

export type LoginResponseDto = Omit<User, 'password' | 'salt'> & {
  authorizationToken: string;
  refreshToken: string;
};
