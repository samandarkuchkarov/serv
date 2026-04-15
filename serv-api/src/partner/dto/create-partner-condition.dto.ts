import { IsOptional, IsString } from 'class-validator';

export class CreatePartnerConditionDto {
  @IsString()
  name_ru: string;

  @IsOptional()
  @IsString()
  name_uz?: string;
}
