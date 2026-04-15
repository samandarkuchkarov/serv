import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMainCharDto {
  @IsString()
  @IsNotEmpty()
  name_uz!: string;

  @IsString()
  @IsNotEmpty()
  name_ru!: string;
}
