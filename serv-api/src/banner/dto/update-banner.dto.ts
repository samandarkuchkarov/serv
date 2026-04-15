import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  title_uz?: string;

  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  subtitle_uz?: string;

  @IsOptional()
  @IsString()
  subtitle_ru?: string;

  @IsOptional()
  @IsString()
  btn_uz?: string;

  @IsOptional()
  @IsString()
  btn_ru?: string;

  @IsOptional()
  @IsString()
  btn_link?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
