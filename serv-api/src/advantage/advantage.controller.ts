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
import { AdvantageService } from './advantage.service';
import { CreateAdvantageDto } from './dto/create-advantage.dto';
import { UpdateAdvantageDto } from './dto/update-advantage.dto';
import { ReorderAdvantageDto } from './dto/reorder-advantage.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createMulterOptions } from '../common/upload/multer.config';

@Controller('advantages')
export class AdvantageController {
  constructor(private readonly advantageService: AdvantageService) {}

  @Get()
  getPublicAdvantages() {
    return this.advantageService.getPublicAdvantages();
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllAdvantages() {
    return this.advantageService.getAllAdvantages();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('advantages')))
  create(
    @Body() dto: CreateAdvantageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    return this.advantageService.create(dto, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderAdvantageDto) {
    return this.advantageService.reorder(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('advantages')))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdvantageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.advantageService.update(id, dto, file?.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.advantageService.toggleVisibility(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advantageService.remove(id);
  }
}
