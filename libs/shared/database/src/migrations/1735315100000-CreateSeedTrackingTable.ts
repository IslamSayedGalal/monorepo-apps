import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { idColumn } from '../base/base.columns';

export class CreateSeedTrackingTable1735315100000 implements MigrationInterface {
  private readonly tableName = 'seeds';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          idColumn,
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'executed_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}

