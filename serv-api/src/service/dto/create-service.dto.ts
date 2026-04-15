import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateServiceDto {
  @IsString() @IsNotEmpty() title_uz!: string;
  @IsString() @IsNotEmpty() title_ru!: string;
  @IsString() @IsNotEmpty() descr_uz!: string;
  @IsString() @IsNotEmpty() descr_ru!: string;
  @IsString() @IsNotEmpty() btn_name_uz!: string;
  @IsString() @IsNotEmpty() btn_name_ru!: string;
  @IsString() @IsNotEmpty() btn_link!: string;
  @IsString() @IsNotEmpty() freebtn_uz!: string;
  @IsString() @IsNotEmpty() freebtn_ru!: string;
  @IsString() @IsNotEmpty() more_link!: string;
  @IsString() @IsNotEmpty() morename_uz!: string;
  @IsString() @IsNotEmpty() morename_ru!: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_visible?: boolean;
}
