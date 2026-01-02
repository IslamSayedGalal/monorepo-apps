import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { idColumn, auditColumns } from '../base/base.columns';
import { UserStatus } from '@my-workspace/shared-common';

export class CreateUserTable1735315200000 implements MigrationInterface {
  private readonly tableName = 'users';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          idColumn,
          {
            name: 'login',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'status',
            type: 'enum',
            enumName: 'user_status_enum',
            enum: Object.values(UserStatus),
            default: `'${UserStatus.ACTIVE}'`,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cover_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'enum',
            enum: ['email', 'google', 'firebase'],
            default: "'email'",
          },
          {
            name: 'firebase_uid',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_login',
            type: 'timestamptz',
            isNullable: true,
          },
          ...auditColumns,
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
