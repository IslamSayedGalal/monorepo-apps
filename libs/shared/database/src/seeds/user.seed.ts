import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { USERS_DATA, UserLookup } from '@my-workspace/shared-common';

export class UserSeed implements Seeder {
  private readonly seedName = 'UserSeed';

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      // Check if seeds tracking table exists
      const seedsTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'seeds'
        )
      `);

      if (!seedsTableExists[0].exists) {
        console.log('Table "seeds" does not exist. Please run migrations first: npm run migration:run');
        return;
      }

      // Check if this seed was already executed
      const existingSeed = await queryRunner.query(
        `SELECT * FROM seeds WHERE name = $1`,
        [this.seedName],
      );

      if (existingSeed.length > 0) {
        console.log(`Seed "${this.seedName}" already executed, skipping...`);
        return;
      }

      // Check if users table exists
      const usersTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'users'
        )
      `);

      if (!usersTableExists[0].exists) {
        console.log('Table "users" does not exist. Please run migrations first.');
        return;
      }

      // Check if already has data
      const existingUsers = await queryRunner.query(
        `SELECT COUNT(*) as count FROM users`,
      );

      if (parseInt(existingUsers[0].count, 10) > 0) {
        console.log('Users table already has data, skipping insert...');
      } else {
        for (const user of USERS_DATA) {
          await queryRunner.query(`
            INSERT INTO users (login, email, password, first_name, last_name, status, provider, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [
            user.login,
            user.email,
            user.password,
            user.firstName || null,
            user.lastName || null,
            user.status,
            user.provider,
          ]);
        }
      }

      // Record the seed execution
      await queryRunner.query(
        `INSERT INTO seeds (name, executed_at) VALUES ($1, CURRENT_TIMESTAMP)`,
        [this.seedName],
      );

      console.log(`Seed "${this.seedName}" executed successfully!`);
    } finally {
      await queryRunner.release();
    }
  }
}

