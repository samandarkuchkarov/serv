import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, UseInterceptors,
  UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { createMulterOptions } from '../common/upload/multer.config';

class ReorderItemDto {
  @IsString() id: string;
  @IsInt() @Type(() => Number) order: number;
}

class ReorderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  getPublic() {
    return this.serviceService.getPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.serviceService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.serviceService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.serviceService.reorder(dto.items);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('services')))
  create(
    @Body() dto: CreateServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    return this.serviceService.create(dto, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('services')))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.serviceService.update(id, dto, file?.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.serviceService.toggleVisibility(id);
  }
}
