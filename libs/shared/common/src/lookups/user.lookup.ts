import { UserStatus } from '../enums/user-status.enum';
import { AuthProvider } from '../enums/auth-provider.enum';

export interface UserLookup {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  provider: AuthProvider;
}

export const USERS_DATA: UserLookup[] = [
  {
    login: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password" hashed
    firstName: 'Admin',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
  },
  {
    login: 'user',
    email: 'user@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password" hashed
    firstName: 'Regular',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    provider: AuthProvider.EMAIL,
  },
];



