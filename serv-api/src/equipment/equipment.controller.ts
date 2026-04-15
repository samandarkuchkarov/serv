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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateMainCharDto } from './dto/create-main-char.dto';
import { UpdateMainCharDto } from './dto/update-main-char.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createMulterOptions } from '../common/upload/multer.config';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get()
  getPublic() {
    return this.equipmentService.getPublic();
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.equipmentService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.equipmentService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img', createMulterOptions('equipments')))
  create(
    @Body() dto: CreateEquipmentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    return this.equipmentService.create(dto, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('img', createMulterOptions('equipments')))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.equipmentService.update(id, dto, file?.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.equipmentService.toggleVisibility(id);
  }

  // ─── MainChar ─────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(':id/chars')
  createChar(@Param('id') id: string, @Body() dto: CreateMainCharDto) {
    return this.equipmentService.createChar(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('chars/:charId')
  updateChar(@Param('charId') charId: string, @Body() dto: UpdateMainCharDto) {
    return this.equipmentService.updateChar(charId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('chars/:charId')
  removeChar(@Param('charId') charId: string) {
    return this.equipmentService.removeChar(charId);
  }
}
