import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMainCharDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name_uz?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name_ru?: string;
}
