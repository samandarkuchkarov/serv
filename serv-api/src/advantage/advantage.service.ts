import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdvantageDto } from './dto/create-advantage.dto';
import { UpdateAdvantageDto } from './dto/update-advantage.dto';
import { ReorderAdvantageDto } from './dto/reorder-advantage.dto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS = { public: 'advantages:public', all: 'advantages:all' };

@Injectable()
export class AdvantageService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getPublicAdvantages() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.advantage.findMany({
      where: { isVisible: true },
      orderBy: { position: 'asc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  async getAllAdvantages() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.advantage.findMany({
      orderBy: { position: 'asc' },
    });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  async create(dto: CreateAdvantageDto, imageFilename: string) {
    const maxPositionResult = await this.prisma.advantage.aggregate({
      _max: { position: true },
    });
    const nextPosition = (maxPositionResult._max.position ?? -1) + 1;
    const result = await this.prisma.advantage.create({
      data: {
        ...dto,
        image: imageFilename,
        position: dto.position ?? nextPosition,
      },
    });
    await this.invalidate();
    return result;
  }

  async update(id: string, dto: UpdateAdvantageDto, imageFilename?: string) {
    await this.findOneOrFail(id);
    const result = await this.prisma.advantage.update({
      where: { id },
      data: { ...dto, ...(imageFilename ? { image: imageFilename } : {}) },
    });
    await this.invalidate();
    return result;
  }

  async remove(id: string) {
    const advantage = await this.findOneOrFail(id);
    const imagePath = path.join(process.cwd(), 'uploads', advantage.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    await this.prisma.advantage.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Advantage deleted' };
  }

  async toggleVisibility(id: string) {
    const advantage = await this.findOneOrFail(id);
    const result = await this.prisma.advantage.update({
      where: { id },
      data: { isVisible: !advantage.isVisible },
    });
    await this.invalidate();
    return result;
  }

  async reorder(dto: ReorderAdvantageDto) {
    const { ids } = dto;
    const advantages = await this.prisma.advantage.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    if (advantages.length !== ids.length) {
      throw new BadRequestException('One or more advantage IDs not found');
    }
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.advantage.update({ where: { id }, data: { position: index } }),
      ),
    );
    await this.invalidate();
    return this.getAllAdvantages();
  }

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findOneOrFail(id: string) {
    const advantage = await this.prisma.advantage.findUnique({ where: { id } });
    if (!advantage) throw new NotFoundException(`Advantage #${id} not found`);
    return advantage;
  }
}
