import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, jwtConfig } from '@my-workspace/shared-common';
import { DatabaseModule } from '@my-workspace/shared-database';
import { appConfig } from './config/app.config';
import { PlaylistModule } from './playlist/playlist.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    DatabaseModule.forRootAsync(() => ({
      host: process.env['DB_HOST'] || 'localhost',
      port: parseInt(process.env['DB_PORT'] || '5432', 10),
      username: process.env['DB_USERNAME'] || 'postgres',
      password: process.env['DB_PASSWORD'] || 'postgres',
      database: process.env['DB_DATABASE'] || 'app_db',
    })),
    PlaylistModule,
    TagsModule,
  ],
})
export class AppModule {}
