import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Riwaya } from '../../domain/entities/riwaya.entity';
import { IRiwayaRepository } from '../../domain/repositories/riwaya.repository';
import { RiwayaMapper } from './mappers/riwaya.mapper';
import { RiwayaOrmEntity } from './typeorm/riwaya.orm-entity';

@Injectable()
export class RiwayaRepositoryImpl implements IRiwayaRepository {
  constructor(
    @InjectRepository(RiwayaOrmEntity)
    private readonly repository: Repository<RiwayaOrmEntity>
  ) {}

  async findById(id: number): Promise<Riwaya | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? RiwayaMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Riwaya[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return RiwayaMapper.toDomainList(entities);
  }

  async findPaginated(
    page: number,
    limit: number
  ): Promise<{ data: Riwaya[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: RiwayaMapper.toDomainList(entities),
      total,
    };
  }

  async save(riwaya: Riwaya): Promise<Riwaya> {
    const entity = RiwayaMapper.toPersistence(riwaya);
    const saved = await this.repository.save(entity);
    return RiwayaMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}
