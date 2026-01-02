import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Check for existing login
    const existingLogin = await this.userRepository.existsByLogin(dto.login);
    if (existingLogin) {
      throw new ConflictException('Login already exists');
    }

    // Check for existing email
    const existingEmail = await this.userRepository.existsByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const email = Email.create(dto.email);

    const user = User.create({
      login: dto.login,
      email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      provider: dto.provider ?? AuthProvider.EMAIL,
      firebaseUid: dto.firebaseUid,
      imageUrl: dto.imageUrl,
    });

    return this.userRepository.save(user);
  }
}

