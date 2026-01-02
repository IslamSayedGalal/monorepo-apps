import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { CreateUserUseCase } from '../application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../application/use-cases/update-user.usecase';
import { ActivateUserUseCase } from '../application/use-cases/activate-user.usecase';
import { SuspendUserUseCase } from '../application/use-cases/suspend-user.usecase';
import { BanUserUseCase } from '../application/use-cases/ban-user.usecase';
import { UserOrmEntity } from '../infrastructure/persistence/typeorm/user.orm-entity';
import { UserRepositoryImpl } from '../infrastructure/persistence/user.repository.impl';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    ActivateUserUseCase,
    SuspendUserUseCase,
    BanUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}

