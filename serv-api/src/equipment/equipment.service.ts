import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateMainCharDto } from './dto/create-main-char.dto';
import { UpdateMainCharDto } from './dto/update-main-char.dto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS = { public: 'equipment:public', all: 'equipment:all' };

const includeChars = {
  main_chars: {
    orderBy: { created_at: 'asc' as const },
    omit: { equipment_id: true },
  },
};

@Injectable()
export class EquipmentService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  async getPublic() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.equipment.findMany({
      where: { is_visible: true },
      include: includeChars,
      orderBy: { created_at: 'asc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  async getAll() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.equipment.findMany({
      include: includeChars,
      orderBy: { created_at: 'asc' },
    });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  getOne(id: string) {
    return this.findOneOrFail(id);
  }

  // ─── Equipment CRUD ───────────────────────────────────────────────────────

  async create(dto: CreateEquipmentDto, imgFilename: string) {
    const result = await this.prisma.equipment.create({
      data: { ...dto, img: imgFilename },
      include: includeChars,
    });
    await this.invalidate();
    return result;
  }

  async update(id: string, dto: UpdateEquipmentDto, imgFilename?: string) {
    await this.findOneOrFail(id);
    const result = await this.prisma.equipment.update({
      where: { id },
      data: { ...dto, ...(imgFilename ? { img: imgFilename } : {}) },
      include: includeChars,
    });
    await this.invalidate();
    return result;
  }

  async remove(id: string) {
    const equipment = await this.findOneOrFail(id);
    const imgPath = path.join(process.cwd(), 'uploads', 'equipments', equipment.img);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    await this.prisma.equipment.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Equipment deleted' };
  }

  async toggleVisibility(id: string) {
    const equipment = await this.findOneOrFail(id);
    const result = await this.prisma.equipment.update({
      where: { id },
      data: { is_visible: !equipment.is_visible },
      include: includeChars,
    });
    await this.invalidate();
    return result;
  }

  // ─── MainChar CRUD ────────────────────────────────────────────────────────

  async createChar(equipment_id: string, dto: CreateMainCharDto) {
    await this.findOneOrFail(equipment_id);
    const result = await this.prisma.mainChar.create({
      data: { ...dto, equipment_id },
      omit: { equipment_id: true },
    });
    await this.invalidate();
    return result;
  }

  async updateChar(charId: string, dto: UpdateMainCharDto) {
    await this.findCharOrFail(charId);
    const result = await this.prisma.mainChar.update({
      where: { id: charId },
      data: dto,
      omit: { equipment_id: true },
    });
    await this.invalidate();
    return result;
  }

  async removeChar(charId: string) {
    await this.findCharOrFail(charId);
    await this.prisma.mainChar.delete({ where: { id: charId } });
    await this.invalidate();
    return { message: 'Char deleted' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findOneOrFail(id: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: includeChars,
    });
    if (!equipment) throw new NotFoundException(`Equipment #${id} not found`);
    return equipment;
  }

  private async findCharOrFail(id: string) {
    const char = await this.prisma.mainChar.findUnique({ where: { id } });
    if (!char) throw new NotFoundException(`MainChar #${id} not found`);
    return char;
  }
}
