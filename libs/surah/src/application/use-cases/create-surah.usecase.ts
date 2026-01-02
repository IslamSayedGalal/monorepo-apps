import { Inject, Injectable } from '@nestjs/common';
import { Surah } from '../../domain/entities/surah.entity';
import { SurahName } from '../../domain/value-objects/surah-name.vo';
import {
  ISurahRepository,
  SURAH_REPOSITORY,
} from '../../domain/repositories/surah.repository';
import { CreateSurahDto } from '../dto/create-surah.dto';

@Injectable()
export class CreateSurahUseCase {
  constructor(
    @Inject(SURAH_REPOSITORY)
    private readonly surahRepository: ISurahRepository,
  ) {}

  async execute(dto: CreateSurahDto): Promise<Surah> {
    const name = SurahName.create(dto.nameArabic, dto.nameEnglish);

    const surah = Surah.create({
      name,
      ayahsCount: dto.ayahsCount,
    });

    return this.surahRepository.save(surah);
  }
}

