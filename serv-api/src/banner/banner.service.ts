import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ReorderBannersDto } from './dto/reorder-banners.dto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS = { public: 'banners:public', all: 'banners:all' };

@Injectable()
export class BannerService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getPublicBanners() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.banner.findMany({
      where: { isVisible: true },
      orderBy: { position: 'asc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  async getAllBanners() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.banner.findMany({
      orderBy: { position: 'asc' },
    });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  async create(dto: CreateBannerDto, imageFilename: string) {
    const maxPositionResult = await this.prisma.banner.aggregate({
      _max: { position: true },
    });
    const nextPosition = (maxPositionResult._max.position ?? -1) + 1;

    const result = await this.prisma.banner.create({
      data: {
        ...dto,
        image: imageFilename,
        position: dto.position ?? nextPosition,
      },
    });
    await this.invalidate();
    return result;
  }

  async update(id: string, dto: UpdateBannerDto, imageFilename?: string) {
    await this.findOneOrFail(id);

    const result = await this.prisma.banner.update({
      where: { id },
      data: {
        ...dto,
        ...(imageFilename ? { image: imageFilename } : {}),
      },
    });
    await this.invalidate();
    return result;
  }

  async remove(id: string) {
    const banner = await this.findOneOrFail(id);

    const imagePath = path.join(process.cwd(), 'uploads', banner.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await this.prisma.banner.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Banner deleted' };
  }

  async toggleVisibility(id: string) {
    const banner = await this.findOneOrFail(id);
    const result = await this.prisma.banner.update({
      where: { id },
      data: { isVisible: !banner.isVisible },
    });
    await this.invalidate();
    return result;
  }

  async reorder(dto: ReorderBannersDto) {
    const { ids } = dto;

    const banners = await this.prisma.banner.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (banners.length !== ids.length) {
      throw new BadRequestException('One or more banner IDs not found');
    }

    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.banner.update({
          where: { id },
          data: { position: index },
        }),
      ),
    );

    await this.invalidate();
    return this.getAllBanners();
  }

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findOneOrFail(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException(`Banner #${id} not found`);
    return banner;
  }
}
