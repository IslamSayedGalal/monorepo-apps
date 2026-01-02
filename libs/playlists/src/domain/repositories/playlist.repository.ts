import { Playlist } from '../entities/playlist.entity';

export interface IPlaylistRepository {
  findById(id: string): Promise<Playlist | null>;
  findByUserId(userId: string): Promise<Playlist[]>;
  findPublic(): Promise<Playlist[]>;
  save(playlist: Playlist): Promise<Playlist>;
  update(playlist: Playlist): Promise<Playlist>;
  delete(id: string): Promise<void>;
}

export const PLAYLIST_REPOSITORY = Symbol('IPlaylistRepository');

