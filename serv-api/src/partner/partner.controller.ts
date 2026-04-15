import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ReorderItemDto {
  @IsString() id!: string;
  @IsInt() @Type(() => Number) order!: number;
}

class ReorderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { CreatePartnerConditionDto } from './dto/create-partner-condition.dto';
import { UpdatePartnerConditionDto } from './dto/update-partner-condition.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createMulterOptions } from '../common/upload/multer.config';

type PartnerFiles = {
  logo?: Express.Multer.File[];
  partner_card?: Express.Multer.File[];
  images?: Express.Multer.File[];
};

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get()
  getPublic() {
    return this.partnerService.getPublic();
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.partnerService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.partnerService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'partner_card', maxCount: 1 },
        { name: 'images', maxCount: 20 },
      ],
      createMulterOptions('partners'),
    ),
  )
  create(@Body() dto: CreatePartnerDto, @UploadedFiles() files: PartnerFiles) {
    return this.partnerService.create(dto, {
      logo: files?.logo?.[0]?.filename,
      partner_card: files?.partner_card?.[0]?.filename,
      images: files?.images?.map((f) => f.filename),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.partnerService.reorder(dto.items);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'partner_card', maxCount: 1 },
        { name: 'images', maxCount: 20 },
      ],
      createMulterOptions('partners'),
    ),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerDto,
    @UploadedFiles() files: PartnerFiles,
  ) {
    return this.partnerService.update(id, dto, {
      logo: files?.logo?.[0]?.filename,
      partner_card: files?.partner_card?.[0]?.filename,
      images: files?.images?.map((f) => f.filename),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.partnerService.toggleVisibility(id);
  }

  // ─── Conditions ───────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(':id/conditions')
  createCondition(
    @Param('id') id: string,
    @Body() dto: CreatePartnerConditionDto,
  ) {
    return this.partnerService.createCondition(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('conditions/:conditionId')
  updateCondition(
    @Param('conditionId') conditionId: string,
    @Body() dto: UpdatePartnerConditionDto,
  ) {
    return this.partnerService.updateCondition(conditionId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('conditions/:conditionId')
  removeCondition(@Param('conditionId') conditionId: string) {
    return this.partnerService.removeCondition(conditionId);
  }
}
