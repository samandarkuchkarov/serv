import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  title_uz!: string;

  @IsString()
  @IsNotEmpty()
  title_ru!: string;

  @IsString()
  @IsNotEmpty()
  more_btn_uz!: string;

  @IsString()
  @IsNotEmpty()
  more_btn_ru!: string;

  @IsString()
  @IsNotEmpty()
  info_uz!: string;

  @IsString()
  @IsNotEmpty()
  info_ru!: string;

  @IsOptional()
  @IsString()
  description_uz?: string;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsString()
  seo_uz?: string;

  @IsOptional()
  @IsString()
  seo_ru?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_visible?: boolean;
}
