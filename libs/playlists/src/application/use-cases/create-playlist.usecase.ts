import { Inject, Injectable } from '@nestjs/common';
import { Playlist } from '../../domain/entities/playlist.entity';
import { PlaylistName } from '../../domain/value-objects/playlist-name.vo';
import {
  IPlaylistRepository,
  PLAYLIST_REPOSITORY,
} from '../../domain/repositories/playlist.repository';
import { CreatePlaylistCommand } from '../commands/create-playlist.command';

@Injectable()
export class CreatePlaylistUseCase {
  constructor(
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlistRepository: IPlaylistRepository,
  ) { }

  async execute(command: CreatePlaylistCommand): Promise<Playlist> {
    const name = PlaylistName.create(command.name);

    const playlist = Playlist.create({
      name,
      userId: command.userId,
      description: command.description,
    });

    return this.playlistRepository.save(playlist);
  }
}

