import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { USERS_DATA } from '@my-workspace/shared-common';

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
        console.log(
          'Table "seeds" does not exist. Please run migrations first: npm run migration:run'
        );
        return;
      }

      // Check if this seed was already executed
      const existingSeed = await queryRunner.query(
        `SELECT * FROM seeds WHERE name = $1`,
        [this.seedName]
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
        console.log(
          'Table "users" does not exist. Please run migrations first.'
        );
        return;
      }

      // Check if user_roles table exists
      const userRolesTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'user_roles'
        )
      `);

      if (!userRolesTableExists[0].exists) {
        console.log(
          'Table "user_roles" does not exist. Please run migrations first.'
        );
        return;
      }

      // Check if already has data
      const existingUsers = await queryRunner.query(
        `SELECT COUNT(*) as count FROM users`
      );

      if (parseInt(existingUsers[0].count, 10) > 0) {
        console.log('Users table already has data, skipping insert...');
      } else {
        for (const user of USERS_DATA) {
          // Insert user and get the inserted user ID
          const insertResult = await queryRunner.query(
            `
            INSERT INTO users (login, email, password, first_name, last_name, status, provider, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id
          `,
            [
              user.login,
              user.email,
              user.password,
              user.firstName || null,
              user.lastName || null,
              user.status,
              user.provider,
            ]
          );

          const userId = insertResult[0].id;

          // Get the role ID by role name
          const roleResult = await queryRunner.query(
            `SELECT id FROM roles WHERE name = $1`,
            [user.role]
          );

          if (roleResult.length === 0) {
            console.log(
              `Warning: Role "${user.role}" not found for user "${user.login}". Skipping role assignment.`
            );
            continue;
          }

          const roleId = roleResult[0].id;

          // Assign role to user
          await queryRunner.query(
            `
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id) DO NOTHING
          `,
            [userId, roleId]
          );

          console.log(`Assigned role "${user.role}" to user "${user.login}"`);
        }
      }

      // Record the seed execution
      await queryRunner.query(
        `INSERT INTO seeds (name, executed_at) VALUES ($1, CURRENT_TIMESTAMP)`,
        [this.seedName]
      );

      console.log(`Seed "${this.seedName}" executed successfully!`);
    } finally {
      await queryRunner.release();
    }
  }
}
