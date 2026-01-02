import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig, DatabaseConfig } from './typeorm.config';

@Module({})
export class DatabaseModule {
  static forRoot(config: DatabaseConfig): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(createTypeOrmConfig(config))],
      exports: [TypeOrmModule],
    };
  }

  static forRootAsync(
    configFactory: () => Promise<DatabaseConfig> | DatabaseConfig,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            const config = await configFactory();
            return createTypeOrmConfig(config);
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
