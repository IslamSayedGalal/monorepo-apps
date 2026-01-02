import { SurahName } from '../value-objects/surah-name.vo';

export interface SurahProps {
  id?: number;
  name: SurahName;
  ayahsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Surah {
  private readonly _id?: number;
  private _name: SurahName;
  private _ayahsCount?: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: SurahProps) {
    this._id = props.id;
    this._name = props.name;
    this._ayahsCount = props.ayahsCount;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this.validateAyahsCount();
  }

  // ============ Getters ============

  get id(): number | undefined {
    return this._id;
  }

  get name(): SurahName {
    return this._name;
  }

  get nameArabic(): string | undefined {
    return this._name.arabic;
  }

  get nameEnglish(): string | undefined {
    return this._name.english;
  }

  get ayahsCount(): number | undefined {
    return this._ayahsCount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ============ Domain Behavior ============

  updateName(name: SurahName): void {
    this._name = name;
    this.touch();
  }

  updateAyahsCount(count: number | undefined): void {
    this._ayahsCount = count;
    this.validateAyahsCount();
    this.touch();
  }

  // ============ Private Methods ============

  private touch(): void {
    this._updatedAt = new Date();
  }

  private validateAyahsCount(): void {
    if (this._ayahsCount !== undefined && this._ayahsCount < 1) {
      throw new Error('Ayahs count must be at least 1');
    }
  }

  // ============ Factory Methods ============

  static create(
    props: Omit<SurahProps, 'id' | 'createdAt' | 'updatedAt'>
  ): Surah {
    return new Surah(props);
  }

  static reconstitute(props: SurahProps): Surah {
    return new Surah(props);
  }
}
