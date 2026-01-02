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
import { CreateRiwayaDto } from '../../application/dto/create-riwaya.dto';
import { UpdateRiwayaDto } from '../../application/dto/update-riwaya.dto';
import { CreateRiwayaUseCase } from '../../application/use-cases/create-riwaya.usecase';
import { UpdateRiwayaUseCase } from '../../application/use-cases/update-riwaya.usecase';
import {
  IRiwayaRepository,
  RIWAYA_REPOSITORY,
} from '../../domain/repositories/riwaya.repository';

@Controller('riwaya')
export class RiwayaController {
  constructor(
    private readonly createRiwayaUseCase: CreateRiwayaUseCase,
    private readonly updateRiwayaUseCase: UpdateRiwayaUseCase,
    @Inject(RIWAYA_REPOSITORY)
    private readonly riwayaRepository: IRiwayaRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreateRiwayaDto) {
    return this.createRiwayaUseCase.execute(dto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (page && limit) {
      return this.riwayaRepository.findPaginated(page, limit);
    }
    return this.riwayaRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const riwaya = await this.riwayaRepository.findById(id);
    if (!riwaya) {
      throw new NotFoundException(`Riwaya with id ${id} not found`);
    }
    return riwaya;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRiwayaDto) {
    return this.updateRiwayaUseCase.execute(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.riwayaRepository.delete(id);
  }
}

