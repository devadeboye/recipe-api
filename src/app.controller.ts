import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): { message: string; error: boolean } {
    return this.appService.getHello();
  }
}
