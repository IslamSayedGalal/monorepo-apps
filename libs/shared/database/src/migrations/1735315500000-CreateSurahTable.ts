import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { idColumn, auditColumns } from '../base/base.columns';

export class CreateSurahTable1735315500000 implements MigrationInterface {
  private readonly tableName = 'surah';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          idColumn,
          {
            name: 'name_arabic',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name_english',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ayahs_count',
            type: 'integer',
            isNullable: false,
          },
          ...auditColumns,
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
