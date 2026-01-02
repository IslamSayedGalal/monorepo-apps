import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recitation } from '../../domain/entities/recitation.entity';
import { IRecitationRepository } from '../../domain/repositories/recitation.repository';
import { RecitationMapper } from './mappers/recitation.mapper';
import { RecitationOrmEntity } from './typeorm/recitation.orm-entity';
import { RecitationStatus } from '@my-workspace/shared-common';

@Injectable()
export class RecitationRepositoryImpl implements IRecitationRepository {
  private readonly defaultRelations = ['surah', 'riwaya', 'user'];

  constructor(
    @InjectRepository(RecitationOrmEntity)
    private readonly repository: Repository<RecitationOrmEntity>,
  ) { }

  async findById(id: number): Promise<Recitation | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: this.defaultRelations,
    });
    return entity ? RecitationMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: number): Promise<Recitation[]> {
    const entities = await this.repository.find({
      where: { user: { id: userId } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return RecitationMapper.toDomainList(entities);
  }

  async findBySurahId(surahId: number): Promise<Recitation[]> {
    const entities = await this.repository.find({
      where: { surah: { id: surahId } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return RecitationMapper.toDomainList(entities);
  }

  async findByRiwayaId(riwayaId: number): Promise<Recitation[]> {
    const entities = await this.repository.find({
      where: { riwaya: { id: riwayaId } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return RecitationMapper.toDomainList(entities);
  }

  async findByStatus(status: RecitationStatus): Promise<Recitation[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return RecitationMapper.toDomainList(entities);
  }

  async findAll(): Promise<Recitation[]> {
    const entities = await this.repository.find({
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return RecitationMapper.toDomainList(entities);
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: Recitation[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      relations: this.defaultRelations,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: RecitationMapper.toDomainList(entities),
      total,
    };
  }

  async save(recitation: Recitation): Promise<Recitation> {
    const entity = RecitationMapper.toPersistence(recitation);
    const saved = await this.repository.save(entity);
    // Reload with relations to get the full entity
    const reloaded = await this.findById(saved.id);
    return reloaded!;
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}
