import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class ReorderAdvantageDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids!: string[];
}
