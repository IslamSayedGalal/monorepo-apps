import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from '@my-workspace/playlists';

@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @Headers('x-user-id') userIdHeader?: string
  ) {
    // TODO: Get userId from authenticated user
    // For now, accept from header for testing, or use placeholder
    const userId = userIdHeader ? parseInt(userIdHeader, 10) : 3;
    
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    
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
