import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user.updateProfile({
      firstName: dto.firstName,
      lastName: dto.lastName,
      imageUrl: dto.imageUrl,
      coverUrl: dto.coverUrl,
      country: dto.country,
      city: dto.city,
      bio: dto.bio,
      phoneNumber: dto.phoneNumber,
    });

    if (dto.langKey) {
      user.updateLanguage(dto.langKey);
    }

    return this.userRepository.save(user);
  }
}

