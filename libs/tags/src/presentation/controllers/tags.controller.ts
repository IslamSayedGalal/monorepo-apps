import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Inject,
    NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from '../../application/dto/create-tag.dto';
import { UpdateTagDto } from '../../application/dto/update-tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.usecase';
import {
    ITagRepository,
    TAG_REPOSITORY,
} from '../../domain/repositories/tag.repository';

@Controller('tags')
export class TagsController {
    constructor(
        private readonly createTagUseCase: CreateTagUseCase,
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository,
    ) { }

    @Post()
    async create(@Body() dto: CreateTagDto) {
        return this.createTagUseCase.execute(dto);
    }

    @Get()
    async findAll() {
        return this.tagRepository.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const tag = await this.tagRepository.findById(id);
        if (!tag) {
            throw new NotFoundException('Tag not found');
        }
        return tag;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
        const tag = await this.tagRepository.findById(id);
        if (!tag) {
            throw new NotFoundException('Tag not found');
        }

        if (dto.name) {
            tag.updateName(dto.name);
        }
        if (dto.description !== undefined) {
            tag.updateDescription(dto.description);
        }
        if (dto.color !== undefined) {
            tag.updateColor(dto.color);
        }

        return this.tagRepository.update(tag);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tagRepository.delete(id);
    }
}

