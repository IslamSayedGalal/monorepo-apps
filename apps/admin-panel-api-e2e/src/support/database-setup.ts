import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

let testDataSource: DataSource | null = null;

export async function getTestDataSource(): Promise<DataSource> {
  if (testDataSource && testDataSource.isInitialized) {
    return testDataSource;
  }

  const testDbConfig = {
    type: 'postgres' as const,
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || process.env.DB_PORT || '5432', 10),
    username: process.env.TEST_DB_USERNAME || process.env.DB_USERNAME || 'postgres',
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_DATABASE || 'app_db_test',
    synchronize: false,
    logging: false,
    migrations: ['libs/shared/database/src/migrations/*.ts'],
    entities: [
      'libs/shared/database/src/entities/*.orm-entity.ts',
      'libs/**/infrastructure/persistence/typeorm/*.orm-entity.ts',
    ],
  };

  testDataSource = new DataSource(testDbConfig);
  await testDataSource.initialize();

  return testDataSource;
}

export async function runMigrations(): Promise<void> {
  const dataSource = await getTestDataSource();
  await dataSource.runMigrations();
}

export async function closeTestDataSource(): Promise<void> {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.destroy();
    testDataSource = null;
  }
}
