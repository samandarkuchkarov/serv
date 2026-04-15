import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS = { public: 'constructor:public', all: 'constructor:all' };

@Injectable()
export class ConstructorService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  async getPublic() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.section.findMany({
      include: {
        items: {
          where: { is_visible: true, is_archived: false },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'asc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  async getAll() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.section.findMany({
      include: { items: { orderBy: { created_at: 'asc' } } },
      orderBy: { created_at: 'asc' },
    });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  // ─── Sections ─────────────────────────────────────────────────────────────

  async createSection(dto: CreateSectionDto) {
    const result = await this.prisma.section.create({ data: dto });
    await this.invalidate();
    return result;
  }

  async updateSection(id: string, dto: UpdateSectionDto) {
    await this.findSectionOrFail(id);
    const result = await this.prisma.section.update({ where: { id }, data: dto });
    await this.invalidate();
    return result;
  }

  async removeSection(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!section) throw new NotFoundException(`Section #${id} not found`);
    for (const item of section.items) {
      this.deleteItemFiles(item.image, item.image_uz);
    }
    await this.prisma.section.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Section deleted' };
  }

  // ─── Items ────────────────────────────────────────────────────────────────

  async createItem(section_id: string, dto: CreateItemDto, image?: string, image_uz?: string) {
    await this.findSectionOrFail(section_id);
    const result = await this.prisma.constructorItem.create({
      data: {
        ...dto,
        section_id,
        ...(image ? { image } : {}),
        ...(image_uz ? { image_uz } : {}),
      },
    });
    await this.invalidate();
    return result;
  }

  async updateItem(id: string, dto: UpdateItemDto, image?: string, image_uz?: string) {
    await this.findItemOrFail(id);
    const result = await this.prisma.constructorItem.update({
      where: { id },
      data: {
        ...dto,
        ...(image ? { image } : {}),
        ...(image_uz ? { image_uz } : {}),
      },
    });
    await this.invalidate();
    return result;
  }

  async removeItem(id: string) {
    const item = await this.findItemOrFail(id);
    this.deleteItemFiles(item.image, item.image_uz);
    await this.prisma.constructorItem.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Item deleted' };
  }

  async toggleVisibility(id: string) {
    const item = await this.findItemOrFail(id);
    const result = await this.prisma.constructorItem.update({
      where: { id },
      data: { is_visible: !item.is_visible },
    });
    await this.invalidate();
    return result;
  }

  async toggleArchive(id: string) {
    const item = await this.findItemOrFail(id);
    const result = await this.prisma.constructorItem.update({
      where: { id },
      data: { is_archived: !item.is_archived },
    });
    await this.invalidate();
    return result;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findSectionOrFail(id: string) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section) throw new NotFoundException(`Section #${id} not found`);
    return section;
  }

  private async findItemOrFail(id: string) {
    const item = await this.prisma.constructorItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return item;
  }

  private deleteItemFiles(image?: string | null, image_uz?: string | null) {
    for (const filename of [image, image_uz]) {
      if (!filename) continue;
      const filePath = path.join(process.cwd(), 'uploads', 'constructor', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
}
