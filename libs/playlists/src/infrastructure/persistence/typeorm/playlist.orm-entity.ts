import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';

@Entity('playlists')
export class PlaylistOrmEntity extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'is_public', default: false })
  isPublic!: boolean;
}

