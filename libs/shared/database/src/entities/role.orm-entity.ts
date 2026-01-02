import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('roles')
export class RoleOrmEntity extends BaseEntity {
  @Column({ length: 50, unique: true })
  name!: string;

  @Column({ length: 255, nullable: true })
  description?: string;
}

