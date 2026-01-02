import { IsString, IsOptional, MaxLength, IsNumber, Min } from 'class-validator';

export class UpdateSurahDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nameArabic?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  nameEnglish?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  ayahsCount?: number;
}

