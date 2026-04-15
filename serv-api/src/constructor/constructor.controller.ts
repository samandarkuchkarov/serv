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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConstructorService } from './constructor.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createMulterOptions } from '../common/upload/multer.config';

@Controller('constructor')
export class ConstructorController {
  constructor(private readonly constructorService: ConstructorService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get()
  getPublic() {
    return this.constructorService.getPublic();
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.constructorService.getAll();
  }

  // ─── Sections ─────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('sections')
  createSection(@Body() dto: CreateSectionDto) {
    return this.constructorService.createSection(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.constructorService.updateSection(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sections/:id')
  removeSection(@Param('id') id: string) {
    return this.constructorService.removeSection(id);
  }

  // ─── Items ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('sections/:sectionId/items')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'image_uz', maxCount: 1 },
      ],
      createMulterOptions('constructor'),
    ),
  )
  createItem(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateItemDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; image_uz?: Express.Multer.File[] },
  ) {
    return this.constructorService.createItem(
      sectionId,
      dto,
      files?.image?.[0]?.filename,
      files?.image_uz?.[0]?.filename,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'image_uz', maxCount: 1 },
      ],
      createMulterOptions('constructor'),
    ),
  )
  updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; image_uz?: Express.Multer.File[] },
  ) {
    return this.constructorService.updateItem(
      id,
      dto,
      files?.image?.[0]?.filename,
      files?.image_uz?.[0]?.filename,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.constructorService.removeItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.constructorService.toggleVisibility(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id/archive')
  toggleArchive(@Param('id') id: string) {
    return this.constructorService.toggleArchive(id);
  }
}
