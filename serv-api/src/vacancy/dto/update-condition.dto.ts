import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateConditionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  condition_name_ru?: string;

  @IsOptional()
  @IsString()
  condition_name_uz?: string;
}
