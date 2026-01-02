export class CreatePlaylistCommand {
  constructor(
    public readonly name: string,
    public readonly userId: number,
    public readonly description?: string,
  ) { }
}
