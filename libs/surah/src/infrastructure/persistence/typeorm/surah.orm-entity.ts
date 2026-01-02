import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';

@Entity('surah')
export class SurahOrmEntity extends BaseEntity {
  @Column({ name: 'name_arabic', nullable: true })
  nameArabic?: string;

  @Column({ name: 'name_english', nullable: true })
  nameEnglish?: string;

  @Column({ type: 'integer', name: 'ayahs_count', nullable: true })
  ayahsCount?: number;
}

