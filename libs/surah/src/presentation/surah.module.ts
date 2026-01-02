import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurahController } from './controllers/surah.controller';
import { CreateSurahUseCase } from '../application/use-cases/create-surah.usecase';
import { UpdateSurahUseCase } from '../application/use-cases/update-surah.usecase';
import { SurahOrmEntity } from '../infrastructure/persistence/typeorm/surah.orm-entity';
import { SurahRepositoryImpl } from '../infrastructure/persistence/surah.repository.impl';
import { SURAH_REPOSITORY } from '../domain/repositories/surah.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SurahOrmEntity])],
  controllers: [SurahController],
  providers: [
    CreateSurahUseCase,
    UpdateSurahUseCase,
    {
      provide: SURAH_REPOSITORY,
      useClass: SurahRepositoryImpl,
    },
  ],
  exports: [SURAH_REPOSITORY],
})
export class SurahModule {}

