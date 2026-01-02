import {
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateRecitationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsUrl()
  recitationUrl!: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  fromAyah?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  toAyah?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  duration?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  size?: number;

  @IsNumber()
  @IsOptional()
  surahId?: number;

  @IsNumber()
  @IsOptional()
  riwayaId?: number;

  @IsNumber()
  userId!: number;
}
