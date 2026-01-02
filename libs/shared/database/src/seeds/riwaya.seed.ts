import { DataSource, QueryRunner } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RIWAYAS_DATA, RiwayaLookup } from '@my-workspace/shared-common';

export class RiwayaSeed implements Seeder {
  private readonly seedName = 'RiwayaSeed';

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

      // Check if riwaya table exists
      const riwayaTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'riwaya'
        )
      `);

      if (!riwayaTableExists[0].exists) {
        console.log(
          'Table "riwaya" does not exist. Please run migrations first.'
        );
        return;
      }

      // Check if already has data
      const existingRiwayas = await queryRunner.query(
        `SELECT COUNT(*) as count FROM riwaya`
      );

      if (parseInt(existingRiwayas[0].count, 10) > 0) {
        console.log('Riwaya table already has data, skipping insert...');
      } else {
        for (const riwaya of RIWAYAS_DATA) {
          await queryRunner.query(
            `
            INSERT INTO riwaya (name_arabic, name_english, created_at, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
            [riwaya.nameArabic, riwaya.nameEnglish]
          );
        }
        console.log(`Inserted ${RIWAYAS_DATA.length} riwayas`);
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
