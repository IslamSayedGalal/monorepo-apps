import { DataSource, QueryRunner } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ROLES_DATA, RoleLookup } from '@my-workspace/shared-common';

export class RoleSeed implements Seeder {
  private readonly seedName = 'RoleSeed';

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

      // Check if roles table exists
      const rolesTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'roles'
        )
      `);

      if (!rolesTableExists[0].exists) {
        console.log('Table "roles" does not exist. Please run migrations first.');
        return;
      }

      // Check if already has data
      const existingRoles = await queryRunner.query(
        `SELECT COUNT(*) as count FROM roles`,
      );

      if (parseInt(existingRoles[0].count, 10) > 0) {
        console.log('Roles table already has data, skipping insert...');
      } else {
        const values = ROLES_DATA.map(
          (role: RoleLookup) => `('${role.name}', '${role.description}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        ).join(',\n        ');

        await queryRunner.query(`
          INSERT INTO roles (name, description, created_at, updated_at) VALUES
          ${values}
        `);
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
