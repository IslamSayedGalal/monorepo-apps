import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagOrmEntity, TagRepositoryImpl } from '@my-workspace/tags';

@Module({
  imports: [TypeOrmModule.forFeature([TagOrmEntity])],
  controllers: [TagsController],
  providers: [TagsService, TagRepositoryImpl],
  exports: [TagsService],
})
export class TagsModule {}
