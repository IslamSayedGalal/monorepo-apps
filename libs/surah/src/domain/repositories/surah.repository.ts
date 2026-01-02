import { Surah } from '../entities/surah.entity';

export interface ISurahRepository {
  findById(id: number): Promise<Surah | null>;
  findAll(): Promise<Surah[]>;
  findPaginated(page: number, limit: number): Promise<{ data: Surah[]; total: number }>;
  save(surah: Surah): Promise<Surah>;
  delete(id: number): Promise<void>;
  existsById(id: number): Promise<boolean>;
}

export const SURAH_REPOSITORY = Symbol('ISurahRepository');

