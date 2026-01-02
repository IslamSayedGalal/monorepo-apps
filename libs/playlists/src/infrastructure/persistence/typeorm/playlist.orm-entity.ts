import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';
import { PlaylistPrivacy } from '@my-workspace/shared-common';
import { UserOrmEntity } from '@my-workspace/user';

@Entity('playlists')
export class PlaylistOrmEntity extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({
    type: 'enum',
    enum: PlaylistPrivacy,
    default: PlaylistPrivacy.PRIVATE,
  })
  privacy!: PlaylistPrivacy;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', nullable: true })
  code?: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;
}
