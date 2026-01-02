import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRiwayaDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nameArabic?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  nameEnglish?: string;
}

