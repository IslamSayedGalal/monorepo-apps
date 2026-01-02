import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';

@Entity('tags')
export class TagOrmEntity extends BaseEntity {
  @Column({ length: 50 })
  name!: string;

  @Index({ unique: true })
  @Column({ length: 60 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 7, nullable: true })
  color?: string;
}

