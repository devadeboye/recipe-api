import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable()
export class SignUpPipe implements PipeTransform {
  public constructor(private readonly userService: UserService) {}

  public async transform(value: User): Promise<User> {
    // check if user name exists
    const usernameExists = await this.userService.propExists({
      username: value.username,
    });
    if (usernameExists) {
      throw new ConflictException('username already exists');
    }
    return value;
  }
}
