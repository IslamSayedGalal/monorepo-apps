export interface BaseEntityProps {
  id?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export abstract class BaseEntity {
  protected readonly _id?: number;
  protected _createdBy?: string;
  protected readonly _createdAt: Date;
  protected _updatedBy?: string;
  protected _updatedAt: Date;

  constructor(props: BaseEntityProps) {
    this._id = props.id;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedBy = props.updatedBy;
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get createdBy(): string | undefined {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedBy(): string | undefined {
    return this._updatedBy;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  protected setUpdatedBy(updatedBy: string): void {
    this._updatedBy = updatedBy;
    this.touch();
  }
}

