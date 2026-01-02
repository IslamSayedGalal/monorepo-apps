import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserOrmEntity } from './typeorm/user.orm-entity';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByLogin(login: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { login } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { firebaseUid } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { googleId } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const entities = await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
    return UserMapper.toDomainList(entities);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return UserMapper.toDomainList(entities);
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: UserMapper.toDomainList(entities),
      total,
    };
  }

  async save(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async existsByLogin(login: string): Promise<boolean> {
    const count = await this.repository.count({ where: { login } });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }
}

