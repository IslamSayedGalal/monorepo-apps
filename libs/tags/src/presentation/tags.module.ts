import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './controllers/tags.controller';
import { CreateTagUseCase } from '../application/use-cases/create-tag.usecase';
import { TagOrmEntity } from '../infrastructure/persistence/typeorm/tag.orm-entity';
import { TagRepositoryImpl } from '../infrastructure/persistence/tag.repository.impl';
import { TAG_REPOSITORY } from '../domain/repositories/tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagOrmEntity])],
  controllers: [TagsController],
  providers: [
    CreateTagUseCase,
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
  ],
  exports: [TAG_REPOSITORY],
})
export class TagsModule { }

