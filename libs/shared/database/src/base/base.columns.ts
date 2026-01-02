import { TableColumnOptions } from 'typeorm';

export const idColumn: TableColumnOptions = {
  name: 'id',
  type: 'int4',
  isPrimary: true,
  isGenerated: true,
  generationStrategy: 'increment',
};

export const auditColumns: TableColumnOptions[] = [
  {
    name: 'created_by',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'created_at',
    type: 'timestamptz',
    default: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'updated_by',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'updated_at',
    type: 'timestamptz',
    default: 'CURRENT_TIMESTAMP',
  },
];

export const baseColumns: TableColumnOptions[] = [idColumn, ...auditColumns];

