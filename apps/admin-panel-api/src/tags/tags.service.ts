import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagOrmEntity } from '@my-workspace/tags';
import { CreateTagDto, UpdateTagDto } from '@my-workspace/tags';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagOrmEntity)
    private readonly tagRepository: Repository<TagOrmEntity>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    // Generate slug from name if not provided
    const slug = this.generateSlug(createTagDto.name);
    
    // Generate code if not provided
    const code = createTagDto.name.toLowerCase().replace(/\s+/g, '-');

    const tag = this.tagRepository.create({
      ...createTagDto,
      slug,
      code,
      isActive: true,
    });

    return await this.tagRepository.save(tag);
  }

  async findAll() {
    return await this.tagRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    
    // Update slug if name is being updated
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      tag.slug = this.generateSlug(updateTagDto.name);
    }

    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
    return { message: 'Tag deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

