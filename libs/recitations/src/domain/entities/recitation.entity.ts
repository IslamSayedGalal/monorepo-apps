import { RecitationStatus } from '@my-workspace/shared-common';
import { RecitationTitle } from '../value-objects/recitation-title.vo';

export interface RecitationProps {
  id?: number;
  title: RecitationTitle;
  recitationUrl: string;
  coverUrl?: string;
  code?: string;
  description?: string;
  fromAyah?: number;
  toAyah?: number;
  duration?: number;
  size?: number;
  status: RecitationStatus;
  rejectionReason?: string;
  actionDate?: Date;
  surahId?: number;
  riwayaId?: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Recitation {
  private readonly _id?: number;
  private _title: RecitationTitle;
  private _recitationUrl: string;
  private _coverUrl?: string;
  private _code?: string;
  private _description?: string;
  private _fromAyah?: number;
  private _toAyah?: number;
  private _duration?: number;
  private _size?: number;
  private _status: RecitationStatus;
  private _rejectionReason?: string;
  private _actionDate?: Date;
  private _surahId?: number;
  private _riwayaId?: number;
  private readonly _userId: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: RecitationProps) {
    this._id = props.id;
    this._title = props.title;
    this._recitationUrl = props.recitationUrl;
    this._coverUrl = props.coverUrl;
    this._code = props.code;
    this._description = props.description;
    this._fromAyah = props.fromAyah;
    this._toAyah = props.toAyah;
    this._duration = props.duration;
    this._size = props.size;
    this._status = props.status;
    this._rejectionReason = props.rejectionReason;
    this._actionDate = props.actionDate;
    this._surahId = props.surahId;
    this._riwayaId = props.riwayaId;
    this._userId = props.userId;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this.validateAyahRange();
  }

  // ============ Getters ============

  get id(): number | undefined {
    return this._id;
  }

  get title(): RecitationTitle {
    return this._title;
  }

  get recitationUrl(): string {
    return this._recitationUrl;
  }

  get coverUrl(): string | undefined {
    return this._coverUrl;
  }

  get code(): string | undefined {
    return this._code;
  }

  get description(): string | undefined {
    return this._description;
  }

  get fromAyah(): number | undefined {
    return this._fromAyah;
  }

  get toAyah(): number | undefined {
    return this._toAyah;
  }

  get duration(): number | undefined {
    return this._duration;
  }

  get size(): number | undefined {
    return this._size;
  }

  get status(): RecitationStatus {
    return this._status;
  }

  get rejectionReason(): string | undefined {
    return this._rejectionReason;
  }

  get actionDate(): Date | undefined {
    return this._actionDate;
  }

  get surahId(): number | undefined {
    return this._surahId;
  }

  get riwayaId(): number | undefined {
    return this._riwayaId;
  }

  get userId(): number | undefined {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ============ Domain Status Checks ============

  get isPending(): boolean {
    return this._status === RecitationStatus.PENDING;
  }

  get isApproved(): boolean {
    return this._status === RecitationStatus.APPROVED;
  }

  get isRejected(): boolean {
    return this._status === RecitationStatus.REJECTED;
  }

  // ============ Domain Behavior ============

  approve(): void {
    if (!this.isPending) {
      throw new Error('Only pending recitations can be approved');
    }
    this._status = RecitationStatus.APPROVED;
    this._actionDate = new Date();
    this._rejectionReason = undefined;
    this.touch();
  }

  reject(reason: string): void {
    if (!this.isPending) {
      throw new Error('Only pending recitations can be rejected');
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error('Rejection reason is required');
    }
    this._status = RecitationStatus.REJECTED;
    this._rejectionReason = reason.trim();
    this._actionDate = new Date();
    this.touch();
  }

  updateTitle(title: RecitationTitle): void {
    this._title = title;
    this.touch();
  }

  updateRecitationUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error('Recitation URL cannot be empty');
    }
    this._recitationUrl = url.trim();
    this.touch();
  }

  updateCoverUrl(url: string | undefined): void {
    this._coverUrl = url?.trim() || undefined;
    this.touch();
  }

  updateDescription(description: string | undefined): void {
    this._description = description?.trim() || undefined;
    this.touch();
  }

  updateAyahRange(fromAyah: number | undefined, toAyah: number | undefined): void {
    this._fromAyah = fromAyah;
    this._toAyah = toAyah;
    this.validateAyahRange();
    this.touch();
  }

  updateDuration(duration: number | undefined): void {
    if (duration !== undefined && duration < 0) {
      throw new Error('Duration cannot be negative');
    }
    this._duration = duration;
    this.touch();
  }

  updateSize(size: number | undefined): void {
    if (size !== undefined && size < 0) {
      throw new Error('Size cannot be negative');
    }
    this._size = size;
    this.touch();
  }

  updateSurah(surahId: number | undefined): void {
    this._surahId = surahId;
    this.touch();
  }

  updateRiwaya(riwayaId: number | undefined): void {
    this._riwayaId = riwayaId;
    this.touch();
  }

  // ============ Private Methods ============

  private touch(): void {
    this._updatedAt = new Date();
  }

  private validateAyahRange(): void {
    if (this._fromAyah !== undefined && this._toAyah !== undefined) {
      if (this._fromAyah > this._toAyah) {
        throw new Error('fromAyah cannot be greater than toAyah');
      }
    }
    if (this._fromAyah !== undefined && this._fromAyah < 1) {
      throw new Error('fromAyah must be at least 1');
    }
    if (this._toAyah !== undefined && this._toAyah < 1) {
      throw new Error('toAyah must be at least 1');
    }
  }

  // ============ Factory Methods ============

  static create(
    props: Omit<RecitationProps, 'id' | 'status' | 'rejectionReason' | 'actionDate' | 'createdAt' | 'updatedAt'>,
  ): Recitation {
    return new Recitation({
      ...props,
      status: RecitationStatus.PENDING,
    });
  }

  static reconstitute(props: RecitationProps): Recitation {
    return new Recitation(props);
  }
}
