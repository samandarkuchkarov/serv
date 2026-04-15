import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class ReorderBannersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids!: string[];
}
