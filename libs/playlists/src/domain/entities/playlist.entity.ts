import { PlaylistPrivacy } from '@my-workspace/shared-common';
import type { PlaylistName } from '../value-objects/playlist-name.vo';

export interface PlaylistProps {
  id?: number;
  name: PlaylistName;
  description?: string;
  privacy?: PlaylistPrivacy;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Playlist {
  private readonly _id?: number;
  private _name: PlaylistName;
  private _description?: string;
  private readonly _userId: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PlaylistProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._userId = props.userId;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get name(): PlaylistName {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get userId(): number {
    return this._userId;
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
    this._updatedAt = new Date();
  }

  makePrivate(): void {
    this._updatedAt = new Date();
  }

  static create(
    props: Omit<PlaylistProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Playlist {
    return new Playlist(props);
  }
}
