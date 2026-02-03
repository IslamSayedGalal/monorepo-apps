import { killPort } from '@nx/node/utils';
import { closeTestDataSource } from './database-setup';

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  
  // Close test database connection
  try {
    await closeTestDataSource();
  } catch (error) {
    console.error('Failed to close test data source:', error);
  }
  
  const port = process.env.PORT || process.env.ADMIN_API_PORT
    ? Number(process.env.PORT || process.env.ADMIN_API_PORT)
    : 3001;
  await killPort(port);
  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
