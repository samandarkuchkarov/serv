import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  title_uz!: string;

  @IsString()
  @IsNotEmpty()
  title_ru!: string;

  @IsString()
  @IsNotEmpty()
  subtitle_uz!: string;

  @IsString()
  @IsNotEmpty()
  subtitle_ru!: string;

  @IsString()
  @IsNotEmpty()
  btn_uz!: string;

  @IsString()
  @IsNotEmpty()
  btn_ru!: string;

  @IsString()
  @IsNotEmpty()
  btn_link!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
