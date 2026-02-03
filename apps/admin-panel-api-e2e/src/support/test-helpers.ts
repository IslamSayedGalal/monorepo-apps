import { getTestDataSource } from './database-setup';
import { UserOrmEntity, AuthProvider } from '@my-workspace/user';
import { UserStatus } from '@my-workspace/shared-common';

/**
 * Create a test user for playlist tests
 */
export async function createTestUser(
  overrides?: Partial<{
    login: string;
    email: string;
    firstName: string;
    lastName: string;
  }>
): Promise<UserOrmEntity> {
  const dataSource = await getTestDataSource();
  const userRepository = dataSource.getRepository(UserOrmEntity);

  const testUser = userRepository.create({
    login: overrides?.login || `testuser_${Date.now()}`,
    email: overrides?.email || `test_${Date.now()}@example.com`,
    firstName: overrides?.firstName || 'Test',
    lastName: overrides?.lastName || 'User',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
  });

  return await userRepository.save(testUser);
}

/**
 * Clean up created test data
 */
export async function cleanupTestData(ids: {
  userIds?: number[];
  playlistIds?: number[];
  tagIds?: number[];
}): Promise<void> {
  const dataSource = await getTestDataSource();
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Delete in order to respect foreign keys
    if (ids.playlistIds && ids.playlistIds.length > 0) {
      await queryRunner.query(
        `DELETE FROM playlists WHERE id = ANY($1::int[])`,
        [ids.playlistIds]
      );
    }

    if (ids.tagIds && ids.tagIds.length > 0) {
      await queryRunner.query(
        `DELETE FROM tags WHERE id = ANY($1::int[])`,
        [ids.tagIds]
      );
    }

    if (ids.userIds && ids.userIds.length > 0) {
      await queryRunner.query(
        `DELETE FROM users WHERE id = ANY($1::int[])`,
        [ids.userIds]
      );
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

/**
 * Wait for API server to be ready
 */
export async function waitForServer(
  host = 'localhost',
  port = 3001,
  timeout = 30000
): Promise<void> {
  const startTime = Date.now();
  const axios = require('axios');

  while (Date.now() - startTime < timeout) {
    try {
      await axios.get(`http://${host}:${port}/api/admin`);
      return;
    } catch {
      // Server not ready yet, wait a bit
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Server did not become ready within ${timeout}ms`);
}
