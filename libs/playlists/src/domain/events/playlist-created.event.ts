export class PlaylistCreatedEvent {
  constructor(
    public readonly playlistId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) { }
}

