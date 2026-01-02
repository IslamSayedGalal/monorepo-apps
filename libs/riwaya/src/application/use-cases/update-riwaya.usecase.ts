import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Riwaya } from '../../domain/entities/riwaya.entity';
import { RiwayaName } from '../../domain/value-objects/riwaya-name.vo';
import {
  IRiwayaRepository,
  RIWAYA_REPOSITORY,
} from '../../domain/repositories/riwaya.repository';
import { UpdateRiwayaDto } from '../dto/update-riwaya.dto';

@Injectable()
export class UpdateRiwayaUseCase {
  constructor(
    @Inject(RIWAYA_REPOSITORY)
    private readonly riwayaRepository: IRiwayaRepository,
  ) { }

  async execute(id: number, dto: UpdateRiwayaDto): Promise<Riwaya> {
    const riwaya = await this.riwayaRepository.findById(id);

    if (!riwaya) {
      throw new NotFoundException(`Riwaya with id ${id} not found`);
    }

    const name = RiwayaName.create(dto.nameArabic, dto.nameEnglish);
    riwaya.updateName(name);

    return this.riwayaRepository.save(riwaya);
  }
}

