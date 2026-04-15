import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
