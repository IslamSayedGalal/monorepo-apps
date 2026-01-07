import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from '@my-workspace/tags';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('/')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get('/')
  findAll() {
    return this.tagsService.findAll();
  }

  @Get('/:tagId')
  findOne(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tagsService.findOne(tagId);
  }

  @Patch('/:tagId')
  update(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() updateTagDto: UpdateTagDto
  ) {
    return this.tagsService.update(tagId, updateTagDto);
  }

  @Delete('/:tagId')
  remove(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tagsService.remove(tagId);
  }
}

