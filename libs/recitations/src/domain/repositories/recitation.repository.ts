import { RecitationStatus } from '@my-workspace/shared-common';
import { Recitation } from '../entities/recitation.entity';

export interface IRecitationRepository {
  // Find methods
  findById(id: number): Promise<Recitation | null>;
  findByUserId(userId: number): Promise<Recitation[]>;
  findBySurahId(surahId: number): Promise<Recitation[]>;
  findByRiwayaId(riwayaId: number): Promise<Recitation[]>;
  findByStatus(status: RecitationStatus): Promise<Recitation[]>;
  findAll(): Promise<Recitation[]>;

  // Pagination
  findPaginated(page: number, limit: number): Promise<{ data: Recitation[]; total: number }>;

  // Persistence
  save(recitation: Recitation): Promise<Recitation>;
  delete(id: number): Promise<void>;

  // Check existence
  existsById(id: number): Promise<boolean>;
}

export const RECITATION_REPOSITORY = Symbol('IRecitationRepository');
