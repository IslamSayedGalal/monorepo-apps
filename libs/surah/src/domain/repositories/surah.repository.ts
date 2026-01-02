import { Surah } from '../entities/surah.entity';

export interface ISurahRepository {
  findById(id: string): Promise<Surah | null>;
  findAll(): Promise<Surah[]>;
  findPaginated(page: number, limit: number): Promise<{ data: Surah[]; total: number }>;
  save(surah: Surah): Promise<Surah>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}

export const SURAH_REPOSITORY = Symbol('ISurahRepository');

