import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from '@my-workspace/playlists';

@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    // TODO: Get userId from authenticated user
    const userId = 3; // Placeholder
    return this.playlistService.create(createPlaylistDto, userId);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get(':playlistId')
  findOne(@Param('playlistId', ParseIntPipe) playlistId: number) {
    return this.playlistService.findOne(playlistId);
  }

  @Patch(':playlistId')
  update(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto
  ) {
    return this.playlistService.update(playlistId, updatePlaylistDto);
  }

  @Delete(':playlistId')
  remove(@Param('playlistId', ParseIntPipe) playlistId: number) {
    return this.playlistService.remove(playlistId);
  }
}
