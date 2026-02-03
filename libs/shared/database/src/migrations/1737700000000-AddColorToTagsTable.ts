import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColorToTagsTable1737700000000 implements MigrationInterface {
  private readonly tableName = 'tags';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'color',
        type: 'varchar',
        length: '7',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, 'color');
  }
}
