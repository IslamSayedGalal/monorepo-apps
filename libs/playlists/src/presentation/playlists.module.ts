import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsController } from './controllers/playlists.controller';
import { CreatePlaylistUseCase } from '../application/use-cases/create-playlist.usecase';
import { PlaylistOrmEntity } from '../infrastructure/persistence/typeorm/playlist.orm-entity';
import { PlaylistRepositoryImpl } from '../infrastructure/persistence/playlist.repository.impl';
import { PLAYLIST_REPOSITORY } from '../domain/repositories/playlist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistOrmEntity])],
  controllers: [PlaylistsController],
  providers: [
    CreatePlaylistUseCase,
    {
      provide: PLAYLIST_REPOSITORY,
      useClass: PlaylistRepositoryImpl,
    },
  ],
  exports: [PLAYLIST_REPOSITORY],
})
export class PlaylistsModule { }

