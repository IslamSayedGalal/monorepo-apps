import { RiwayaName } from '../value-objects/riwaya-name.vo';

export interface RiwayaProps {
  id?: number;
  name: RiwayaName;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Riwaya {
  private readonly _id?: number;
  private _name: RiwayaName;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: RiwayaProps) {
    this._id = props.id;
    this._name = props.name;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  // ============ Getters ============

  get id(): number | undefined {
    return this._id;
  }

  get name(): RiwayaName {
    return this._name;
  }

  get nameArabic(): string | undefined {
    return this._name.arabic;
  }

  get nameEnglish(): string | undefined {
    return this._name.english;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ============ Domain Behavior ============

  updateName(name: RiwayaName): void {
    this._name = name;
    this.touch();
  }

  // ============ Private Methods ============

  private touch(): void {
    this._updatedAt = new Date();
  }

  // ============ Factory Methods ============

  static create(props: Omit<RiwayaProps, 'id' | 'createdAt' | 'updatedAt'>): Riwaya {
    return new Riwaya(props);
  }

  static reconstitute(props: RiwayaProps): Riwaya {
    return new Riwaya(props);
  }
}

