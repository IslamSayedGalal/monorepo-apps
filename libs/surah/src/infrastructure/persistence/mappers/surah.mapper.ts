import { Surah } from '../../../domain/entities/surah.entity';
import { SurahName } from '../../../domain/value-objects/surah-name.vo';
import { SurahOrmEntity } from '../typeorm/surah.orm-entity';

export class SurahMapper {
  static toDomain(entity: SurahOrmEntity): Surah {
    return Surah.reconstitute({
      id: entity.id,
      name: SurahName.create(entity.nameArabic, entity.nameEnglish),
      ayahsCount: entity.ayahsCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Surah): SurahOrmEntity {
    const entity = new SurahOrmEntity();

    if (domain.id) {
      entity.id = domain.id;
    }

    entity.nameArabic = domain.nameArabic;
    entity.nameEnglish = domain.nameEnglish;
    entity.ayahsCount = domain.ayahsCount;

    return entity;
  }

  static toDomainList(entities: SurahOrmEntity[]): Surah[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}

