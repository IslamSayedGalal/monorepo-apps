export class CreatePlaylistCommand {
  constructor(
    public readonly name: string,
    public readonly userId: string,
    public readonly description?: string,
    public readonly isPublic = false,
  ) { }
}
