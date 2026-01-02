import { Playlist } from '../entities/playlist.entity';

export interface IPlaylistRepository {
  findById(id: number): Promise<Playlist | null>;
  findByUserId(userId: number): Promise<Playlist[]>;
  findPublic(): Promise<Playlist[]>;
  save(playlist: Playlist): Promise<Playlist>;
  update(playlist: Playlist): Promise<Playlist>;
  delete(id: number): Promise<void>;
}

export const PLAYLIST_REPOSITORY = Symbol('IPlaylistRepository');
