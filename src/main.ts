import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { EnvConfiguration } from './config/enums/env.configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get(EnvConfiguration.PORT);

  await app.listen(port, () => {
    Logger.debug(`listening on port ${port}`);
  });
}
bootstrap();
