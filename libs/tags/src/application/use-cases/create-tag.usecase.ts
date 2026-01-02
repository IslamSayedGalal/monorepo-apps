import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Tag } from '../../domain/entities/tag.entity';
import {
  ITagRepository,
  TAG_REPOSITORY,
} from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dto/create-tag.dto';

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) { }

  async execute(dto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.tagRepository.findByName(dto.name);
    if (existingTag) {
      throw new ConflictException('Tag with this name already exists');
    }

    const tag = Tag.create({
      name: dto.name,
      description: dto.description,
    });

    return this.tagRepository.save(tag);
  }
}

