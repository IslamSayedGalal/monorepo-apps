import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';

@Entity('riwaya')
export class RiwayaOrmEntity extends BaseEntity {
  @Column({ name: 'name_arabic', nullable: true })
  nameArabic?: string;

  @Column({ name: 'name_english', nullable: true })
  nameEnglish?: string;
}

