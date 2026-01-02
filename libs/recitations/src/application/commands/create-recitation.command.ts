export class CreateRecitationCommand {
  constructor(
    public readonly title: string,
    public readonly recitationUrl: string,
    public readonly userId: number,
    public readonly coverUrl?: string,
    public readonly code?: string,
    public readonly description?: string,
    public readonly fromAyah?: number,
    public readonly toAyah?: number,
    public readonly duration?: number,
    public readonly size?: number,
    public readonly surahId?: number,
    public readonly riwayaId?: number,
  ) {}
}
