import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { idColumn, auditColumns } from '../base/base.columns';
import { RecitationStatus } from '@my-workspace/shared-common';

export class CreateRecitationsTable1735315900000 implements MigrationInterface {
  private readonly tableName = 'recitations';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          idColumn,
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'recitation_url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cover_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'from_ayah',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'to_ayah',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'size',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(RecitationStatus),
            enumName: 'recitation_status_enum',
            default: `'${RecitationStatus.PENDING}'`,
          },
          {
            name: 'rejection_reason',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'action_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'surah_id',
            type: 'int4',
            isNullable: true,
          },
          {
            name: 'riwaya_id',
            type: 'int4',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int4',
            isNullable: false,
          },
          ...auditColumns,
        ],
        foreignKeys: [
          {
            columnNames: ['surah_id'],
            referencedTableName: 'surah',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['riwaya_id'],
            referencedTableName: 'riwaya',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
