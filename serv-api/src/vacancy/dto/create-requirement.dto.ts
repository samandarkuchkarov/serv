import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  @IsNotEmpty()
  name_ru!: string;

  @IsOptional()
  @IsString()
  name_uz?: string;
}
