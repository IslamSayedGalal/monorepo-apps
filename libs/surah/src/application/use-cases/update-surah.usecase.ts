import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Surah } from '../../domain/entities/surah.entity';
import { SurahName } from '../../domain/value-objects/surah-name.vo';
import {
  ISurahRepository,
  SURAH_REPOSITORY,
} from '../../domain/repositories/surah.repository';
import { UpdateSurahDto } from '../dto/update-surah.dto';

@Injectable()
export class UpdateSurahUseCase {
  constructor(
    @Inject(SURAH_REPOSITORY)
    private readonly surahRepository: ISurahRepository,
  ) {}

  async execute(id: string, dto: UpdateSurahDto): Promise<Surah> {
    const surah = await this.surahRepository.findById(id);

    if (!surah) {
      throw new NotFoundException(`Surah with id ${id} not found`);
    }

    if (dto.nameArabic !== undefined || dto.nameEnglish !== undefined) {
      const name = SurahName.create(
        dto.nameArabic ?? surah.nameArabic,
        dto.nameEnglish ?? surah.nameEnglish,
      );
      surah.updateName(name);
    }

    if (dto.ayahsCount !== undefined) {
      surah.updateAyahsCount(dto.ayahsCount);
    }

    return this.surahRepository.save(surah);
  }
}

