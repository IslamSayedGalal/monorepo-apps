import { Recitation } from '../entities/recitation.entity';
import { RecitationStatus } from '../enums/recitation-status.enum';

export interface IRecitationRepository {
  // Find methods
  findById(id: string): Promise<Recitation | null>;
  findByUserId(userId: string): Promise<Recitation[]>;
  findBySurahId(surahId: string): Promise<Recitation[]>;
  findByRiwayaId(riwayaId: string): Promise<Recitation[]>;
  findByStatus(status: RecitationStatus): Promise<Recitation[]>;
  findAll(): Promise<Recitation[]>;

  // Pagination
  findPaginated(page: number, limit: number): Promise<{ data: Recitation[]; total: number }>;

  // Persistence
  save(recitation: Recitation): Promise<Recitation>;
  delete(id: string): Promise<void>;

  // Check existence
  existsById(id: string): Promise<boolean>;
}

export const RECITATION_REPOSITORY = Symbol('IRecitationRepository');
