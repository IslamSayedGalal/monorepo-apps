import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecitationsController } from './controllers/recitations.controller';
import { CreateRecitationUseCase } from '../application/use-cases/create-recitation.usecase';
import { RecitationOrmEntity } from '../infrastructure/persistence/typeorm/recitation.orm-entity';
import { RecitationRepositoryImpl } from '../infrastructure/persistence/recitation.repository.impl';
import { RECITATION_REPOSITORY } from '../domain/repositories/recitation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecitationOrmEntity])],
  controllers: [RecitationsController],
  providers: [
    CreateRecitationUseCase,
    {
      provide: RECITATION_REPOSITORY,
      useClass: RecitationRepositoryImpl,
    },
  ],
  exports: [RECITATION_REPOSITORY],
})
export class RecitationsModule { }

