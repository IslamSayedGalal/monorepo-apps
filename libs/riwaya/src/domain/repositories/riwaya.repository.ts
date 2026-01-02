import { Riwaya } from '../entities/riwaya.entity';

export interface IRiwayaRepository {
  findById(id: number): Promise<Riwaya | null>;
  findAll(): Promise<Riwaya[]>;
  findPaginated(page: number, limit: number): Promise<{ data: Riwaya[]; total: number }>;
  save(riwaya: Riwaya): Promise<Riwaya>;
  delete(id: number): Promise<void>;
  existsById(id: number): Promise<boolean>;
}

export const RIWAYA_REPOSITORY = Symbol('IRiwayaRepository');

