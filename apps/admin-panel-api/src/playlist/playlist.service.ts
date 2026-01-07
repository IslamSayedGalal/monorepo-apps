import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    const name = PlaylistName.create(createPlaylistDto.name);
    const playlist = Playlist.create({
      name,
      userId,
      description: createPlaylistDto.description,
    });
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

  async findOne(id: number) {
    const playlist = await this.playlistRepository.findById(id);

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    // Get full entity with relations for admin panel
    const entity = await this.ormRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return entity;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.playlistRepository.findById(id);

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    if (updatePlaylistDto.name) {
      const name = PlaylistName.create(updatePlaylistDto.name);
      playlist.updateName(name);
    }

    if (updatePlaylistDto.description !== undefined) {
      playlist.updateDescription(updatePlaylistDto.description);
    }

    await this.playlistRepository.update(playlist);

    // Return ORM entity with relations for admin panel
    return await this.ormRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async remove(id: number) {
    await this.playlistRepository.delete(id);
    return { message: 'Playlist deleted successfully' };
  }
}
