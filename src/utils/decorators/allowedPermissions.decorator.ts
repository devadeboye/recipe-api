import { SetMetadata } from '@nestjs/common';
import { RoleTypeEnum } from '../enums/user.enum';

export const AllowedRole = (...roles: RoleTypeEnum[]): unknown =>
  SetMetadata('role', roles);
