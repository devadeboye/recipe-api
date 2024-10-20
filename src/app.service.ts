import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello(): { message: string; error: boolean } {
    return {
      message: 'welcome to the recipe app',
      error: false,
    };
  }
}
