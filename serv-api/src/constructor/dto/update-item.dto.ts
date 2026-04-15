import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PageType } from './create-item.dto';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title_uz?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title_ru?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  access_only_by_url?: boolean;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsString()
  description_uz?: string;

  @IsOptional()
  @IsString()
  short_text_ru?: string;

  @IsOptional()
  @IsString()
  short_text_uz?: string;

  @IsOptional()
  @IsString()
  seo_ru?: string;

  @IsOptional()
  @IsString()
  seo_uz?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_visible?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_archived?: boolean;

  @IsOptional()
  @IsEnum(PageType)
  page?: PageType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  cities?: string[];
}
