import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { SURAHS_DATA } from '@my-workspace/shared-common';

export class SurahSeed implements Seeder {
  private readonly seedName = 'SurahSeed';

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

      // Check if surah table exists
      const surahTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'surah'
        )
      `);

      if (!surahTableExists[0].exists) {
        console.log(
          'Table "surah" does not exist. Please run migrations first.'
        );
        return;
      }

      // Check if already has data
      const existingSurahs = await queryRunner.query(
        `SELECT COUNT(*) as count FROM surah`
      );

      if (parseInt(existingSurahs[0].count, 10) > 0) {
        console.log('Surah table already has data, skipping insert...');
      } else {
        for (const surah of SURAHS_DATA) {
          await queryRunner.query(
            `
            INSERT INTO surah (name_arabic, name_english, ayahs_count, created_at, updated_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
            [surah.nameArabic, surah.nameEnglish, surah.ayahsCount]
          );
        }
        console.log(`Inserted ${SURAHS_DATA.length} surahs`);
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
