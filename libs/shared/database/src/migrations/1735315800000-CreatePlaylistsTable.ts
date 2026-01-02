import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { idColumn, auditColumns } from '../base/base.columns';
import { PlaylistPrivacy } from '@my-workspace/shared-common';

export class CreatePlaylistsTable1735315800000 implements MigrationInterface {
  private readonly tableName = 'playlists';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          idColumn,
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int4',
            isNullable: false,
          },
          {
            name: 'privacy',
            type: 'enum',
            enumName: 'playlist_privacy_enum',
            enum: Object.values(PlaylistPrivacy),
            default: `'${PlaylistPrivacy.PRIVATE}'`,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: true,
          },
          ...auditColumns,
        ],
        foreignKeys: [
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
