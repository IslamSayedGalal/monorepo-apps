import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUserRolesTable1735315400000 implements MigrationInterface {
  private readonly tableName = 'user_roles';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'user_id',
            type: 'int4',
            isPrimary: true,
          },
          {
            name: 'role_id',
            type: 'int4',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    // Add foreign key to users
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add foreign key to roles
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add unique constraint on user_id to ensure one role per user
    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: 'IDX_USER_ROLES_USER_UNIQUE',
        columnNames: ['user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}

