import { Inject, Injectable } from '@nestjs/common';
import { Recitation } from '../../domain/entities/recitation.entity';
import { RecitationTitle } from '../../domain/value-objects/recitation-title.vo';
import {
  IRecitationRepository,
  RECITATION_REPOSITORY,
} from '../../domain/repositories/recitation.repository';
import { CreateRecitationDto } from '../dto/create-recitation.dto';

@Injectable()
export class CreateRecitationUseCase {
  constructor(
    @Inject(RECITATION_REPOSITORY)
    private readonly recitationRepository: IRecitationRepository,
  ) {}

  async execute(dto: CreateRecitationDto): Promise<Recitation> {
    const title = RecitationTitle.create(dto.title);

    const recitation = Recitation.create({
      title,
      recitationUrl: dto.recitationUrl,
      coverUrl: dto.coverUrl,
      code: dto.code,
      description: dto.description,
      fromAyah: dto.fromAyah,
      toAyah: dto.toAyah,
      duration: dto.duration,
      size: dto.size,
      surahId: dto.surahId,
      riwayaId: dto.riwayaId,
      userId: dto.userId,
    });

    return this.recitationRepository.save(recitation);
  }
}
