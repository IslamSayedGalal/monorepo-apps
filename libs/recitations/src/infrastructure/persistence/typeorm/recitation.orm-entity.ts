import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@my-workspace/shared-database';
import { RiwayaOrmEntity } from '@my-workspace/riwaya';
import { SurahOrmEntity } from '@my-workspace/surah';
import { UserOrmEntity } from '@my-workspace/user';
import { RecitationStatus } from '@my-workspace/shared-common';

@Entity('recitations')
export class RecitationOrmEntity extends BaseEntity {
  @Column({ length: 200 })
  title!: string;

  @Column({ name: 'recitation_url' })
  recitationUrl!: string;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl?: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'from_ayah', type: 'integer', nullable: true })
  fromAyah?: number;

  @Column({ name: 'to_ayah', type: 'integer', nullable: true })
  toAyah?: number;

  @Column({ type: 'integer', nullable: true })
  duration?: number;

  @Column({ type: 'float', nullable: true })
  size?: number;

  @Column({ type: 'simple-enum', enum: RecitationStatus, default: RecitationStatus.PENDING })
  status!: RecitationStatus;

  @Column({ name: 'rejection_reason', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'action_date', type: 'datetime', nullable: true })
  actionDate?: Date;

  @ManyToOne(() => SurahOrmEntity, { nullable: true })
  @JoinColumn({ name: 'surah_id' })
  surah?: SurahOrmEntity;

  @ManyToOne(() => RiwayaOrmEntity, { nullable: true })
  @JoinColumn({ name: 'riwaya_id' })
  riwaya?: RiwayaOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;
}
