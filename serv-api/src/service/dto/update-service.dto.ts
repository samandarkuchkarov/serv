import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateServiceDto {
  @IsOptional() @IsString() @IsNotEmpty() title_uz?: string;
  @IsOptional() @IsString() @IsNotEmpty() title_ru?: string;
  @IsOptional() @IsString() @IsNotEmpty() descr_uz?: string;
  @IsOptional() @IsString() @IsNotEmpty() descr_ru?: string;
  @IsOptional() @IsString() @IsNotEmpty() btn_name_uz?: string;
  @IsOptional() @IsString() @IsNotEmpty() btn_name_ru?: string;
  @IsOptional() @IsString() @IsNotEmpty() btn_link?: string;
  @IsOptional() @IsString() @IsNotEmpty() freebtn_uz?: string;
  @IsOptional() @IsString() @IsNotEmpty() freebtn_ru?: string;
  @IsOptional() @IsString() @IsNotEmpty() more_link?: string;
  @IsOptional() @IsString() @IsNotEmpty() morename_uz?: string;
  @IsOptional() @IsString() @IsNotEmpty() morename_ru?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_visible?: boolean;
}
