export class CreateSurahCommand {
  constructor(
    public readonly nameArabic?: string,
    public readonly nameEnglish?: string,
    public readonly ayahsCount?: number,
  ) {}
}

