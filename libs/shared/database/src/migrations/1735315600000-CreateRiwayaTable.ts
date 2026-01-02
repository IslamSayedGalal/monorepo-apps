import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { idColumn, auditColumns } from '../base/base.columns';

export class CreateRiwayaTable1735315600000 implements MigrationInterface {
  private readonly tableName = 'riwaya';

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
