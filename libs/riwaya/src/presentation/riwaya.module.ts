import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiwayaController } from './controllers/riwaya.controller';
import { CreateRiwayaUseCase } from '../application/use-cases/create-riwaya.usecase';
import { UpdateRiwayaUseCase } from '../application/use-cases/update-riwaya.usecase';
import { RiwayaOrmEntity } from '../infrastructure/persistence/typeorm/riwaya.orm-entity';
import { RiwayaRepositoryImpl } from '../infrastructure/persistence/riwaya.repository.impl';
import { RIWAYA_REPOSITORY } from '../domain/repositories/riwaya.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RiwayaOrmEntity])],
  controllers: [RiwayaController],
  providers: [
    CreateRiwayaUseCase,
    UpdateRiwayaUseCase,
    {
      provide: RIWAYA_REPOSITORY,
      useClass: RiwayaRepositoryImpl,
    },
  ],
  exports: [RIWAYA_REPOSITORY],
})
export class RiwayaModule {}

