import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Surah } from '../../domain/entities/surah.entity';
import { ISurahRepository } from '../../domain/repositories/surah.repository';
import { SurahMapper } from './mappers/surah.mapper';
import { SurahOrmEntity } from './typeorm/surah.orm-entity';

@Injectable()
export class SurahRepositoryImpl implements ISurahRepository {
  constructor(
    @InjectRepository(SurahOrmEntity)
    private readonly repository: Repository<SurahOrmEntity>,
  ) {}

  async findById(id: string): Promise<Surah | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? SurahMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Surah[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return SurahMapper.toDomainList(entities);
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: Surah[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: SurahMapper.toDomainList(entities),
      total,
    };
  }

  async save(surah: Surah): Promise<Surah> {
    const entity = SurahMapper.toPersistence(surah);
    const saved = await this.repository.save(entity);
    return SurahMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}

