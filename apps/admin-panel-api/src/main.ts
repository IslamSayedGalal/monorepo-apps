import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('AdminPanelAPI');

  const port = configService.get<number>('app.port') || 3001;
  const prefix = configService.get<string>('app.prefix') || 'api/admin';
  const cors = configService.get('app.cors');

  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Enable request logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors(cors);

  await app.listen(port);
  logger.log(
    `🚀 Admin Panel API running on: http://localhost:${port}/${prefix}`
  );
}

bootstrap();
