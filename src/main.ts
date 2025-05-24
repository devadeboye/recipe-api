import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { TokenMiddlewareGuard } from './utils/middlewares/token.guard';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const reflector = app.get(Reflector);
  // use guards needed for access control
  app.useGlobalGuards(new TokenMiddlewareGuard(reflector));

  const port = 3000;

  await app.listen(port, () => {
    Logger.debug(`listening on port ${port}`);
  });
}
bootstrap();
