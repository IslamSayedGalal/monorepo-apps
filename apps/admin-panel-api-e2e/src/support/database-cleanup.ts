import { getTestDataSource } from './database-setup';

/**
 * Clean up test data from database tables
 * This truncates tables in the correct order to respect foreign key constraints
 */
export async function cleanupTestData(): Promise<void> {
  const dataSource = await getTestDataSource();
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Disable foreign key checks temporarily (PostgreSQL)
    await queryRunner.query('SET session_replication_role = replica;');

    // Truncate tables in order (child tables first, then parent tables)
    const tables = [
      'playlists',
      'tags',
      'recitations',
      'user_roles',
      'users',
      'surah',
      'riwaya',
      'roles',
    ];

    for (const table of tables) {
      try {
        await queryRunner.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
      } catch (error) {
        // Table might not exist, ignore
        console.warn(`Table ${table} does not exist or could not be truncated:`, error);
      }
    }

    // Re-enable foreign key checks
    await queryRunner.query('SET session_replication_role = DEFAULT;');

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

/**
 * Clean specific test data by IDs
 */
export async function cleanupSpecificTestData(
  table: string,
  ids: number[]
): Promise<void> {
  if (ids.length === 0) return;

  const dataSource = await getTestDataSource();
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    await queryRunner.query(
      `DELETE FROM ${table} WHERE id IN (${placeholders})`,
      ids
    );
  } finally {
    await queryRunner.release();
  }
}
