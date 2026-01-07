import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import {
  PlaylistOrmEntity,
  PlaylistRepositoryImpl,
} from '@my-workspace/playlists';
import { UserOrmEntity } from '@my-workspace/user';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistOrmEntity, UserOrmEntity])],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepositoryImpl],
  exports: [PlaylistService],
})
export class PlaylistModule {}
