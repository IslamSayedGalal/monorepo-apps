import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@my-workspace/shared-database';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { AuthProvider } from '../../../domain/enums/auth-provider.enum';

@Entity('users')
export class UserOrmEntity extends BaseEntity {
  @Column({ unique: true })
  login!: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'simple-enum', enum: UserStatus, default: UserStatus.PENDING })
  status!: UserStatus;

  @Column({ type: 'varchar' })
  @Exclude()
  password?: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl?: string;

  @Column({ name: 'country', type: 'text', nullable: true })
  country?: string;

  @Column({ name: 'city', type: 'text', nullable: true })
  city?: string;

  @Column({ name: 'bio', type: 'text', nullable: true })
  bio?: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ type: 'simple-enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  provider!: AuthProvider;

  @Column({ name: 'firebase_uid', nullable: true })
  firebaseUid?: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;
}
