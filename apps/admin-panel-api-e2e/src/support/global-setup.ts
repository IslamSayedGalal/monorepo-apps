import { waitForPortOpen } from '@nx/node/utils';
import { runMigrations } from './database-setup';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  // Run database migrations before tests
  try {
    console.log('Running database migrations...');
    await runMigrations();
    console.log('Database migrations completed successfully\n');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT || process.env.ADMIN_API_PORT
    ? Number(process.env.PORT || process.env.ADMIN_API_PORT)
    : 3001;
  await waitForPortOpen(port, { host });

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
