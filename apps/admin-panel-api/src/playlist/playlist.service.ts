import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  PlaylistOrmEntity,
  PlaylistRepositoryImpl,
  Playlist,
  PlaylistName,
} from '@my-workspace/playlists';
import { CreatePlaylistDto, UpdatePlaylistDto } from '@my-workspace/playlists';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistOrmEntity)
    private readonly ormRepository: Repository<PlaylistOrmEntity>,
    private readonly playlistRepository: PlaylistRepositoryImpl
  ) {}

  @Transactional()
  async create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    const name = PlaylistName.create(createPlaylistDto.name);
    const playlist = Playlist.create({
      name,
      userId,
      description: createPlaylistDto.description,
    });

    // Save using repository (automatically within transaction)
    const saved = await this.playlistRepository.save(playlist);

    // Return ORM entity with relations for admin panel
    return await this.ormRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async findAll() {
    // For admin panel, we need all playlists with relations
    return await this.ormRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(playlistId: number) {
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
    }

    // Get full entity with relations for admin panel
    const entity = await this.ormRepository.findOne({
      where: { id: playlistId },
      relations: ['user'],
    });

    return entity;
  }

  @Transactional()
  async update(playlistId: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
    }

    // Update domain entity
    if (updatePlaylistDto.name) {
      const name = PlaylistName.create(updatePlaylistDto.name);
      playlist.updateName(name);
    }

    if (updatePlaylistDto.description !== undefined) {
      playlist.updateDescription(updatePlaylistDto.description);
    }

    // Save using repository (automatically within transaction)
    await this.playlistRepository.update(playlist);

    // Return ORM entity with relations for admin panel
    return await this.ormRepository.findOne({
      where: { id: playlistId },
      relations: ['user'],
    });
  }

  @Transactional()
  async remove(playlistId: number) {
    // Check if playlist exists
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
    }

    // Delete using repository (automatically within transaction)
    await this.playlistRepository.delete(playlistId);

    return { message: 'Playlist deleted successfully' };
  }
}
