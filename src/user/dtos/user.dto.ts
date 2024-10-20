import { SearchFilterDto } from 'src/utils/dtos/search.dto';
import { UserSearchTopLevelFilterKey } from '../enums/user.enum';

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
