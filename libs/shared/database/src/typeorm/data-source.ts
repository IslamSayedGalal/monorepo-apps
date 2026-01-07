import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USERNAME'] || 'cursor_ai',
  password: process.env['DB_PASSWORD'] || 'password',
  database: process.env['DB_DATABASE'] || 'mydb',
  synchronize: false,
  logging: false, // Disable query logging - only show migration statistics
  migrations: ['libs/shared/database/src/migrations/*.ts'],
  entities: ['libs/shared/database/src/entities/*.orm-entity.ts'],
  seeds: ['libs/shared/database/src/seeds/*.seed.ts'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
