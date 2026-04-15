import { IsOptional, IsString } from 'class-validator';

export class UpdatePartnerConditionDto {
  @IsOptional()
  @IsString()
  name_ru?: string;

  @IsOptional()
  @IsString()
  name_uz?: string;
}
