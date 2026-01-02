import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateSurahDto } from '../../application/dto/create-surah.dto';
import { UpdateSurahDto } from '../../application/dto/update-surah.dto';
import { CreateSurahUseCase } from '../../application/use-cases/create-surah.usecase';
import { UpdateSurahUseCase } from '../../application/use-cases/update-surah.usecase';
import {
  ISurahRepository,
  SURAH_REPOSITORY,
} from '../../domain/repositories/surah.repository';

@Controller('surah')
export class SurahController {
  constructor(
    private readonly createSurahUseCase: CreateSurahUseCase,
    private readonly updateSurahUseCase: UpdateSurahUseCase,
    @Inject(SURAH_REPOSITORY)
    private readonly surahRepository: ISurahRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreateSurahDto) {
    return this.createSurahUseCase.execute(dto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (page && limit) {
      return this.surahRepository.findPaginated(page, limit);
    }
    return this.surahRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const surah = await this.surahRepository.findById(id);
    if (!surah) {
      throw new NotFoundException(`Surah with id ${id} not found`);
    }
    return surah;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSurahDto) {
    return this.updateSurahUseCase.execute(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.surahRepository.delete(id);
  }
}

