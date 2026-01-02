import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { CreateRecitationDto } from '../../application/dto/create-recitation.dto';
import { CreateRecitationUseCase } from '../../application/use-cases/create-recitation.usecase';
import {
  IRecitationRepository,
  RECITATION_REPOSITORY,
} from '../../domain/repositories/recitation.repository';
import { RecitationStatus } from '../../domain/enums/recitation-status.enum';

@Controller('recitations')
export class RecitationsController {
  constructor(
    private readonly createRecitationUseCase: CreateRecitationUseCase,
    @Inject(RECITATION_REPOSITORY)
    private readonly recitationRepository: IRecitationRepository,
  ) { }

  @Post()
  async create(@Body() dto: CreateRecitationDto) {
    return this.createRecitationUseCase.execute(dto);
  }

  @Get()
  async findAll(
    @Query('surahId') surahId?: string,
    @Query('riwayaId') riwayaId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: RecitationStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (page && limit) {
      return this.recitationRepository.findPaginated(page, limit);
    }
    if (surahId) {
      return this.recitationRepository.findBySurahId(surahId);
    }
    if (riwayaId) {
      return this.recitationRepository.findByRiwayaId(riwayaId);
    }
    if (userId) {
      return this.recitationRepository.findByUserId(userId);
    }
    if (status) {
      return this.recitationRepository.findByStatus(status);
    }
    return this.recitationRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recitationRepository.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recitationRepository.delete(id);
  }
}
