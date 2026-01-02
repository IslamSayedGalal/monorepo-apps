import { Tag } from '../entities/tag.entity';

export interface ITagRepository {
    findById(id: string): Promise<Tag | null>;
    findBySlug(slug: string): Promise<Tag | null>;
    findByName(name: string): Promise<Tag | null>;
    findAll(): Promise<Tag[]>;
    save(tag: Tag): Promise<Tag>;
    update(tag: Tag): Promise<Tag>;
    delete(id: string): Promise<void>;
}

export const TAG_REPOSITORY = Symbol('ITagRepository');

