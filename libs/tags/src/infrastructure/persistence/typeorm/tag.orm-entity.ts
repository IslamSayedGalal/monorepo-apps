import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';

@Entity('tags')
export class TagOrmEntity extends BaseEntity {
  @Column({ name: 'name', length: 50 })
  name!: string;

  @Index({ unique: true })
  @Column({ name: 'slug', length: 60 })
  slug!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Index({ unique: true })
  @Column({ name: 'code', length: 50 })
  code!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}
