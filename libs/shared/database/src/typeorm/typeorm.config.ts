import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const createTypeOrmConfig = (
  config: DatabaseConfig,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: process.env['NODE_ENV'] !== 'production',
  logging: process.env['NODE_ENV'] === 'development',
  autoLoadEntities: true,
});
