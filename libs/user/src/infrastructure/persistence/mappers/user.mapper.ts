import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserOrmEntity } from '../typeorm/user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return User.reconstitute({
      id: entity.id,
      login: entity.login,
      email: Email.create(entity.email),
      password: entity.password,
      firstName: entity.firstName,
      lastName: entity.lastName,
      status: entity.status,
      imageUrl: entity.imageUrl,
      coverUrl: entity.coverUrl,
      country: entity.country,
      city: entity.city,
      bio: entity.bio,
      phoneNumber: entity.phoneNumber,
      provider: entity.provider,
      firebaseUid: entity.firebaseUid,
      lastLogin: entity.lastLogin,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedBy: entity.updatedBy,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: User): UserOrmEntity {
    const entity = new UserOrmEntity();

    if (domain.id) {
      entity.id = domain.id;
    }

    entity.login = domain.login;
    entity.email = domain.email.value;
    entity.password = domain.password;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.status = domain.status;
    entity.imageUrl = domain.imageUrl;
    entity.coverUrl = domain.coverUrl;
    entity.country = domain.country;
    entity.city = domain.city;
    entity.bio = domain.bio;
    entity.phoneNumber = domain.phoneNumber;
    entity.provider = domain.provider;
    entity.firebaseUid = domain.firebaseUid;
    entity.lastLogin = domain.lastLogin;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;

    return entity;
  }

  static toDomainList(entities: UserOrmEntity[]): User[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
