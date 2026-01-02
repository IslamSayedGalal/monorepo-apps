import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('user_roles')
export class UserRoleOrmEntity {
  @PrimaryColumn({ name: 'user_id', type: 'int4' })
  userId!: number;

  @PrimaryColumn({ name: 'role_id', type: 'int4' })
  roleId!: number;

  @ManyToOne(() => RoleOrmEntity)
  @JoinColumn({ name: 'role_id' })
  role!: RoleOrmEntity;
}

