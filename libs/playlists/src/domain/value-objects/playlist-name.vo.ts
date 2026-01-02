export class PlaylistName {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static create(name: string): PlaylistName {
    const trimmedName = name.trim();

    if (trimmedName.length < PlaylistName.MIN_LENGTH) {
      throw new Error('Playlist name cannot be empty');
    }

    if (trimmedName.length > PlaylistName.MAX_LENGTH) {
      throw new Error(
        `Playlist name cannot exceed ${PlaylistName.MAX_LENGTH} characters`,
      );
    }

    return new PlaylistName(trimmedName);
  }

  equals(other: PlaylistName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
