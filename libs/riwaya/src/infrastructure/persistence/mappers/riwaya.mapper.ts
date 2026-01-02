import { Riwaya } from '../../../domain/entities/riwaya.entity';
import { RiwayaName } from '../../../domain/value-objects/riwaya-name.vo';
import { RiwayaOrmEntity } from '../typeorm/riwaya.orm-entity';

export class RiwayaMapper {
  static toDomain(entity: RiwayaOrmEntity): Riwaya {
    return Riwaya.reconstitute({
      id: entity.id,
      name: RiwayaName.create(entity.nameArabic, entity.nameEnglish),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Riwaya): RiwayaOrmEntity {
    const entity = new RiwayaOrmEntity();

    if (domain.id) {
      entity.id = domain.id;
    }

    entity.nameArabic = domain.nameArabic;
    entity.nameEnglish = domain.nameEnglish;

    return entity;
  }

  static toDomainList(entities: RiwayaOrmEntity[]): Riwaya[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}

