import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
} from '@nestjs/common';
import { CreatePlaylistDto } from '../../application/dto/create-playlist.dto';
import { UpdatePlaylistDto } from '../../application/dto/update-playlist.dto';
import { CreatePlaylistUseCase } from '../../application/use-cases/create-playlist.usecase';
import { CreatePlaylistCommand } from '../../application/commands/create-playlist.command';
import {
  IPlaylistRepository,
  PLAYLIST_REPOSITORY,
} from '../../domain/repositories/playlist.repository';

@Controller('playlists')
export class PlaylistsController {
  constructor(
    private readonly createPlaylistUseCase: CreatePlaylistUseCase,
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlistRepository: IPlaylistRepository,
  ) { }

  @Post()
  async create(@Body() dto: CreatePlaylistDto) {
    const command = new CreatePlaylistCommand(
      dto.name,
      'user-id-placeholder', // Replace with actual user from auth
      dto.description,
      dto.isPublic,
    );
    return this.createPlaylistUseCase.execute(command);
  }

  @Get()
  async findPublic() {
    return this.playlistRepository.findPublic();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.playlistRepository.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePlaylistDto) {
    // Implementation for update
    return { id, ...dto };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.playlistRepository.delete(id);
  }
}

