import { Playlist } from '../../domain/entities/playlist.entity';
import { PlaylistName } from '../../domain/value-objects/playlist-name.vo';
import { PlaylistOrmEntity } from '../persistence/typeorm/playlist.orm-entity';

export class PlaylistMapper {
  static toDomain(entity: PlaylistOrmEntity): Playlist {
    return new Playlist({
      id: entity.id,
      name: PlaylistName.create(entity.name),
      description: entity.description,
      userId: entity.userId,
      isPublic: entity.isPublic,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Playlist): PlaylistOrmEntity {
    const entity = new PlaylistOrmEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name.value;
    entity.description = domain.description;
    entity.userId = domain.userId;
    entity.isPublic = domain.isPublic;
    return entity;
  }
}

