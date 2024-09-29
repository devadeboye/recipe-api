import { AccountStatusEnum } from 'src/user/enums/accountStatus.enum';

export class TokenDto {
  public username: string;
  public accountStatus: AccountStatusEnum;
  public id: string;
}
