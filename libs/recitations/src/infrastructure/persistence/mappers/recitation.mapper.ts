import { Recitation } from '../../../domain/entities/recitation.entity';
import { RecitationTitle } from '../../../domain/value-objects/recitation-title.vo';
import { RecitationOrmEntity } from '../typeorm/recitation.orm-entity';
import { RiwayaOrmEntity } from '@my-workspace/riwaya';
import { SurahOrmEntity } from '@my-workspace/surah';
import { UserOrmEntity } from '@my-workspace/user';

export class RecitationMapper {
  static toDomain(entity: RecitationOrmEntity): Recitation {
    return Recitation.reconstitute({
      id: entity.id,
      title: RecitationTitle.create(entity.title),
      recitationUrl: entity.recitationUrl,
      coverUrl: entity.coverUrl,
      code: entity.code,
      description: entity.description,
      fromAyah: entity.fromAyah,
      toAyah: entity.toAyah,
      duration: entity.duration,
      size: entity.size,
      status: entity.status,
      rejectionReason: entity.rejectionReason,
      actionDate: entity.actionDate,
      surahId: entity.surah?.id,
      riwayaId: entity.riwaya?.id,
      userId: entity.user?.id ?? '',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Recitation): RecitationOrmEntity {
    const entity = new RecitationOrmEntity();

    if (domain.id) {
      entity.id = domain.id;
    }

    entity.title = domain.title.value;
    entity.recitationUrl = domain.recitationUrl;
    entity.coverUrl = domain.coverUrl;
    entity.code = domain.code;
    entity.description = domain.description;
    entity.fromAyah = domain.fromAyah;
    entity.toAyah = domain.toAyah;
    entity.duration = domain.duration;
    entity.size = domain.size;
    entity.status = domain.status;
    entity.rejectionReason = domain.rejectionReason;
    entity.actionDate = domain.actionDate;

    if (domain.surahId) {
      entity.surah = { id: domain.surahId } as SurahOrmEntity;
    }

    if (domain.riwayaId) {
      entity.riwaya = { id: domain.riwayaId } as RiwayaOrmEntity;
    }

    entity.user = { id: domain.userId } as UserOrmEntity;

    return entity;
  }

  static toDomainList(entities: RecitationOrmEntity[]): Recitation[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
