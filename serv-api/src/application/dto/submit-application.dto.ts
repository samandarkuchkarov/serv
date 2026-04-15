import { IsString, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class BitrixFieldsDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() uf_crm_tarif?: string;
  @IsOptional() @IsString() uf_crm_city?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() uf_crm_business?: string;
  @IsOptional() @IsString() company_title?: string;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() abonent_status?: string;
  @IsOptional() @IsString() uf_crm_reklama?: string;
  @IsOptional() @IsString() universal?: string;
  @IsOptional() @IsString() adress?: string;
}

export class SubmitApplicationDto {
  @IsObject()
  @ValidateNested()
  @Type(() => BitrixFieldsDto)
  bitrix!: BitrixFieldsDto;

  @IsOptional() @IsString()
  recaptcha?: string;
}
