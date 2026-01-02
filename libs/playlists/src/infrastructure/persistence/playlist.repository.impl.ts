import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from '../../domain/entities/playlist.entity';
import { IPlaylistRepository } from '../../domain/repositories/playlist.repository';
import { PlaylistOrmEntity } from './typeorm/playlist.orm-entity';
import { PlaylistMapper } from '../mappers/playlist.mapper';
import { PlaylistPrivacy } from '@my-workspace/shared-common';

@Injectable()
export class PlaylistRepositoryImpl implements IPlaylistRepository {
  constructor(
    @InjectRepository(PlaylistOrmEntity)
    private readonly repository: Repository<PlaylistOrmEntity>
  ) {}

  async findById(id: number): Promise<Playlist | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? PlaylistMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: number): Promise<Playlist[]> {
    const entities = await this.repository.find({
      where: { user: { id: userId } },
    });
    return entities.map(PlaylistMapper.toDomain);
  }

  async findPublic(): Promise<Playlist[]> {
    const entities = await this.repository.find({
      where: { privacy: PlaylistPrivacy.PUBLIC },
    });
    return entities.map(PlaylistMapper.toDomain);
  }

  async save(playlist: Playlist): Promise<Playlist> {
    const entity = PlaylistMapper.toPersistence(playlist);
    const saved = await this.repository.save(entity);
    return PlaylistMapper.toDomain(saved);
  }

  async update(playlist: Playlist): Promise<Playlist> {
    const entity = PlaylistMapper.toPersistence(playlist);
    const updated = await this.repository.save(entity);
    return PlaylistMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
