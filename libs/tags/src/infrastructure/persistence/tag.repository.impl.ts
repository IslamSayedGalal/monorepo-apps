import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../domain/entities/tag.entity';
import { ITagRepository } from '../../domain/repositories/tag.repository';
import { TagOrmEntity } from './typeorm/tag.orm-entity';

@Injectable()
export class TagRepositoryImpl implements ITagRepository {
    constructor(
        @InjectRepository(TagOrmEntity)
        private readonly repository: Repository<TagOrmEntity>,
    ) { }

    async findById(id: string): Promise<Tag | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async findBySlug(slug: string): Promise<Tag | null> {
        const entity = await this.repository.findOne({ where: { slug } });
        return entity ? this.toDomain(entity) : null;
    }

    async findByName(name: string): Promise<Tag | null> {
        const entity = await this.repository.findOne({ where: { name } });
        return entity ? this.toDomain(entity) : null;
    }

    async findAll(): Promise<Tag[]> {
        const entities = await this.repository.find();
        return entities.map((e) => this.toDomain(e));
    }

    async save(tag: Tag): Promise<Tag> {
        const entity = this.toPersistence(tag);
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }

    async update(tag: Tag): Promise<Tag> {
        const entity = this.toPersistence(tag);
        const updated = await this.repository.save(entity);
        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }

    private toDomain(entity: TagOrmEntity): Tag {
        return new Tag({
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            description: entity.description,
            color: entity.color,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    private toPersistence(domain: Tag): TagOrmEntity {
        const entity = new TagOrmEntity();
        if (domain.id) {
            entity.id = domain.id;
        }
        entity.name = domain.name;
        entity.slug = domain.slug;
        entity.description = domain.description;
        entity.color = domain.color;
        return entity;
    }
}

