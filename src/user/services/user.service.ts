import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.model';
import { FilterQuery, FlattenMaps, Model } from 'mongoose';
import { AccountStatusEnum } from '../enums/accountStatus.enum';
import {
  UserLoginDto,
  UserSearchFilterDto,
  UserSearchTopLevelFilterDto,
} from '../dtos/user.dto';

@Injectable()
export class UserService {
  public constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  public async create(user: User): Promise<FlattenMaps<User>> {
    const hashedPassword = await User.hashPassword(user.password!);
    const savedUser = (
      await this.userModel.create({
        ...user,
        accountStatus: AccountStatusEnum.Active,
        password: hashedPassword,
      })
    ).toJSON();
    delete savedUser.password;
    return savedUser;
  }

  public async findById(
    userId: string,
    populate: string | string[] = '',
    select: string[] = [],
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findById(userId)
      .select(select)
      .populate(populate)
      .exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  public async propExists(prop: FilterQuery<User>): Promise<boolean> {
    return await this.userModel.countDocuments(prop).then((count) => count > 0);
  }

  public async login(
    loginCredentials: UserLoginDto,
  ): Promise<UserDocument | undefined> {
    const { password, username } = loginCredentials;
    const user = await this.userModel.findOne({ username }).populate([]).exec();

    if (!user) {
      return undefined;
    }
    Logger.debug('stored password: ' + user.password);
    const isValidPassword = await User.isValidPassword(
      password,
      user.password!,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Invalid credentials, kindly check your details again',
      );
    }
    return user;
  }

  public async update(userDetails: User): Promise<UserDocument> {
    const { id, ...rest } = userDetails;
    const user = await this.userModel.findByIdAndUpdate(id, rest, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  public async search(
    filter: UserSearchFilterDto,
    select: string[],
    populate: string[] | string = '',
  ): Promise<{
    count: number;
    totalPages: number;
    currentPage: number;
    users: UserDocument[];
  }> {
    const { id, username, limit, page } = filter;
    const topLevelFilter: UserSearchTopLevelFilterDto = {
      id: undefined,
      username: undefined,
    };
    if (id) {
      topLevelFilter.id = { $in: id };
    }
    if (username) {
      topLevelFilter.username = { $in: username };
    }

    const count = await this.userModel.countDocuments({
      ...topLevelFilter,
    });

    const users = await this.userModel
      .find({
        ...topLevelFilter,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(['-password', ...select])
      .populate(populate);

    const totalPages = Math.ceil(count / limit);
    const currentPage = page;
    return { count, totalPages, currentPage, users };
  }
}
