import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PartnerType } from './create-partner.dto';

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  title_uz?: string;

  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  contact_location_ru?: string;

  @IsOptional()
  @IsString()
  contact_location_uz?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  contact_site?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  grafik?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : undefined))
  order?: number;

  @IsOptional()
  @IsString()
  info_ru?: string;

  @IsOptional()
  @IsString()
  info_uz?: string;

  @IsOptional()
  @IsString()
  cordinates?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : undefined))
  promo_count?: number;

  @IsOptional()
  @IsString()
  promo_info_ru?: string;

  @IsOptional()
  @IsString()
  promo_info_uz?: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsEnum(PartnerType)
  type?: PartnerType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_visible?: boolean;
}
