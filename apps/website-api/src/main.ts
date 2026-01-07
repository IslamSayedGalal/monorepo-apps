import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('WebsiteAPI');

  const port = configService.get<number>('app.port') || 3002;
  const prefix = configService.get<string>('app.prefix') || 'api/website';
  const cors = configService.get('app.cors');

  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors(cors);

  await app.listen(port);
  logger.log(`🚀 Website API running on: http://localhost:${port}/${prefix}`);
}

bootstrap();
