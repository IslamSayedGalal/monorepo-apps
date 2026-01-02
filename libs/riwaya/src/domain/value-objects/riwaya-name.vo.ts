export class RiwayaName {
  private static readonly MAX_LENGTH = 200;

  private readonly _arabic?: string;
  private readonly _english?: string;

  private constructor(arabic?: string, english?: string) {
    this._arabic = arabic;
    this._english = english;
  }

  get arabic(): string | undefined {
    return this._arabic;
  }

  get english(): string | undefined {
    return this._english;
  }

  static create(arabic?: string, english?: string): RiwayaName {
    const trimmedArabic = arabic?.trim();
    const trimmedEnglish = english?.trim();

    if (!trimmedArabic && !trimmedEnglish) {
      throw new Error('At least one name (Arabic or English) is required');
    }

    if (trimmedArabic && trimmedArabic.length > RiwayaName.MAX_LENGTH) {
      throw new Error(`Arabic name cannot exceed ${RiwayaName.MAX_LENGTH} characters`);
    }

    if (trimmedEnglish && trimmedEnglish.length > RiwayaName.MAX_LENGTH) {
      throw new Error(`English name cannot exceed ${RiwayaName.MAX_LENGTH} characters`);
    }

    return new RiwayaName(trimmedArabic || undefined, trimmedEnglish || undefined);
  }

  equals(other: RiwayaName): boolean {
    return this._arabic === other._arabic && this._english === other._english;
  }

  toString(): string {
    return this._english || this._arabic || '';
  }
}

