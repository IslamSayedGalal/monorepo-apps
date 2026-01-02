import { Role } from '../enums/users/role.enum';

export interface RoleLookup {
  name: Role;
  description: string;
}

export const ROLES_DATA: RoleLookup[] = [
  {
    name: Role.SUPER_ADMIN,
    description: 'Super Administrator with full system access',
  },
  {
    name: Role.ADMIN,
    description: 'Administrator with full access',
  },
  {
    name: Role.USER,
    description: 'Regular user',
  },
  {
    name: Role.ANONYMOUS,
    description: 'Anonymous user with limited access',
  },
];
