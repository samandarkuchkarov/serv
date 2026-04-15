import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateAdvantageDto {
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

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
