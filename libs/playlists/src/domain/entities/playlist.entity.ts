import type { PlaylistName } from '../value-objects/playlist-name.vo';

export interface PlaylistProps {
  id?: string;
  name: PlaylistName;
  description?: string;
  userId: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Playlist {
  private readonly _id?: string;
  private _name: PlaylistName;
  private _description?: string;
  private readonly _userId: string;
  private _isPublic: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PlaylistProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._userId = props.userId;
    this._isPublic = props.isPublic;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): PlaylistName {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get userId(): string {
    return this._userId;
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: PlaylistName): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateDescription(description: string | undefined): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  makePublic(): void {
    this._isPublic = true;
    this._updatedAt = new Date();
  }

  makePrivate(): void {
    this._isPublic = false;
    this._updatedAt = new Date();
  }

  static create(
    props: Omit<PlaylistProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Playlist {
    return new Playlist(props);
  }
}
