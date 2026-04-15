import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVacancyDto {
  @IsString()
  @IsNotEmpty()
  title_uz!: string;

  @IsString()
  @IsNotEmpty()
  title_ru!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  contact_phone!: string;

  @IsOptional()
  @IsString()
  contact_name_ru?: string;

  @IsOptional()
  @IsString()
  contact_name_uz?: string;

  @IsOptional()
  @IsString()
  subtitle_ru?: string;

  @IsOptional()
  @IsString()
  subtitle_uz?: string;

  @IsOptional()
  @IsString()
  garant_ru?: string;

  @IsOptional()
  @IsString()
  garant_uz?: string;

  @IsOptional()
  @IsString()
  res_ru?: string;

  @IsOptional()
  @IsString()
  res_uz?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_visible?: boolean;
}
