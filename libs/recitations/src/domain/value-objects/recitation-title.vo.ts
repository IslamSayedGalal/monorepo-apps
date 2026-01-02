export class RecitationTitle {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 200;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static create(title: string): RecitationTitle {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < RecitationTitle.MIN_LENGTH) {
      throw new Error('Recitation title cannot be empty');
    }

    if (trimmedTitle.length > RecitationTitle.MAX_LENGTH) {
      throw new Error(
        `Recitation title cannot exceed ${RecitationTitle.MAX_LENGTH} characters`,
      );
    }

    return new RecitationTitle(trimmedTitle);
  }

  equals(other: RecitationTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

