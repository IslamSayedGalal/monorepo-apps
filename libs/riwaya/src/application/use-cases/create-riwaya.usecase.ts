import { Inject, Injectable } from '@nestjs/common';
import { Riwaya } from '../../domain/entities/riwaya.entity';
import { RiwayaName } from '../../domain/value-objects/riwaya-name.vo';
import {
  IRiwayaRepository,
  RIWAYA_REPOSITORY,
} from '../../domain/repositories/riwaya.repository';
import { CreateRiwayaDto } from '../dto/create-riwaya.dto';

@Injectable()
export class CreateRiwayaUseCase {
  constructor(
    @Inject(RIWAYA_REPOSITORY)
    private readonly riwayaRepository: IRiwayaRepository,
  ) {}

  async execute(dto: CreateRiwayaDto): Promise<Riwaya> {
    const name = RiwayaName.create(dto.nameArabic, dto.nameEnglish);

    const riwaya = Riwaya.create({ name });

    return this.riwayaRepository.save(riwaya);
  }
}

