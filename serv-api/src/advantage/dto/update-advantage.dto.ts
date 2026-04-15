import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateAdvantageDto {
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
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
