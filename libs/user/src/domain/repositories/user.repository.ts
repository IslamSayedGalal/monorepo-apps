import { User } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  findByStatus(status: UserStatus): Promise<User[]>;
  findAll(): Promise<User[]>;
  findPaginated(
    page: number,
    limit: number
  ): Promise<{ data: User[]; total: number }>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  existsById(id: number): Promise<boolean>;
  existsByLogin(login: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
