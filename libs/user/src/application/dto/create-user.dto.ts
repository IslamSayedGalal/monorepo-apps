import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  login!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string;

  @IsString()
  @IsOptional()
  langKey?: string;

  @IsEnum(AuthProvider)
  @IsOptional()
  provider?: AuthProvider;

  @IsString()
  @IsOptional()
  firebaseUid?: string;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

