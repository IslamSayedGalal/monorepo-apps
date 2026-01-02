import { UserStatus } from '../enums/users/user-status.enum';
import { AuthProvider } from '../enums/users/auth-provider.enum';
import { Role } from '../enums/users/role.enum';

export interface UserLookup {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  provider: AuthProvider;
  role: Role;
}

export const USERS_DATA: UserLookup[] = [
  {
    login: 'super_admin',
    email: 'super_admin@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password" hashed
    firstName: 'Super',
    lastName: 'Admin',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
    role: Role.SUPER_ADMIN,
  },
  {
    login: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password" hashed
    firstName: 'Admin',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
    role: Role.ADMIN,
  },
  {
    login: 'user',
    email: 'user@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password" hashed
    firstName: 'Regular',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
    role: Role.USER,
  },
  {
    login: 'anonymous',
    email: 'anonymous@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password" hashed
    firstName: 'Anonymous',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
    role: Role.ANONYMOUS,
  },
];
