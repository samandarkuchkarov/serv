import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS = { public: 'services:public', all: 'services:all' };

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getPublic() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.service.findMany({
      where: { is_visible: true },
      orderBy: { order: 'asc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  async getAll() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.service.findMany({ orderBy: { order: 'asc' } });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  getOne(id: string) {
    return this.findOneOrFail(id);
  }

  async create(dto: CreateServiceDto, imageFilename: string) {
    const result = await this.prisma.service.create({ data: { ...dto, image: imageFilename } });
    await this.invalidate();
    return result;
  }

  async update(id: string, dto: UpdateServiceDto, imageFilename?: string) {
    await this.findOneOrFail(id);
    const result = await this.prisma.service.update({
      where: { id },
      data: { ...dto, ...(imageFilename ? { image: imageFilename } : {}) },
    });
    await this.invalidate();
    return result;
  }

  async remove(id: string) {
    const service = await this.findOneOrFail(id);
    const imgPath = path.join(process.cwd(), 'uploads', 'services', service.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    await this.prisma.service.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Service deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.prisma.service.update({ where: { id: item.id }, data: { order: item.order } }),
      ),
    );
    await this.invalidate();
    return { message: 'Reordered' };
  }

  async toggleVisibility(id: string) {
    const service = await this.findOneOrFail(id);
    const result = await this.prisma.service.update({
      where: { id },
      data: { is_visible: !service.is_visible },
    });
    await this.invalidate();
    return result;
  }

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findOneOrFail(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Service #${id} not found`);
    return service;
  }
}
