import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { CreatePartnerConditionDto } from './dto/create-partner-condition.dto';
import { UpdatePartnerConditionDto } from './dto/update-partner-condition.dto';
import * as fs from 'fs';
import * as path from 'path';

const KEYS = { public: 'partners:public', all: 'partners:all' };

const omitPartnerId = { partner_id: true } as const;

const includeNested = {
  conditions: {
    orderBy: { created_at: 'asc' as const },
    omit: omitPartnerId,
  },
};

@Injectable()
export class PartnerService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getPublic() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.partner.findMany({
      where: { is_visible: true },
      include: includeNested,
      orderBy: { created_at: 'desc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  async getAll() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.partner.findMany({
      include: includeNested,
      orderBy: { order: 'asc' },
    });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  getOne(id: string) {
    return this.findOneOrFail(id);
  }

  // ─── Partner CRUD ─────────────────────────────────────────────────────────

  async create(
    dto: CreatePartnerDto,
    files: { logo?: string; partner_card?: string; images?: string[] },
  ) {
    const result = await this.prisma.partner.create({
      data: {
        ...dto,
        logo: files.logo,
        partner_card: files.partner_card,
        images: files.images ?? [],
      },
      include: includeNested,
    });
    await this.invalidate();
    return result;
  }

  async update(
    id: string,
    dto: UpdatePartnerDto,
    files: { logo?: string; partner_card?: string; images?: string[] },
  ) {
    await this.findOneOrFail(id);
    const result = await this.prisma.partner.update({
      where: { id },
      data: {
        ...dto,
        ...(files.logo !== undefined ? { logo: files.logo } : {}),
        ...(files.partner_card !== undefined
          ? { partner_card: files.partner_card }
          : {}),
        ...(files.images !== undefined ? { images: files.images } : {}),
      },
      include: includeNested,
    });
    await this.invalidate();
    return result;
  }

  async remove(id: string) {
    const partner = await this.findOneOrFail(id);
    const uploadDir = path.join(process.cwd(), 'uploads', 'partners');
    if (partner.logo) {
      const p = path.join(uploadDir, partner.logo);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    if (partner.partner_card) {
      const p = path.join(uploadDir, partner.partner_card);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    for (const img of partner.images) {
      const p = path.join(uploadDir, img);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await this.prisma.partner.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Partner deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.prisma.partner.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    await this.invalidate();
    return { message: 'Reordered' };
  }

  async toggleVisibility(id: string) {
    const partner = await this.findOneOrFail(id);
    const result = await this.prisma.partner.update({
      where: { id },
      data: { is_visible: !partner.is_visible },
      include: includeNested,
    });
    await this.invalidate();
    return result;
  }

  // ─── Conditions ───────────────────────────────────────────────────────────

  async createCondition(partner_id: string, dto: CreatePartnerConditionDto) {
    await this.findOneOrFail(partner_id);
    const result = await this.prisma.partnerCondition.create({
      data: { ...dto, partner_id },
      omit: omitPartnerId,
    });
    await this.invalidate();
    return result;
  }

  async updateCondition(conditionId: string, dto: UpdatePartnerConditionDto) {
    await this.findConditionOrFail(conditionId);
    const result = await this.prisma.partnerCondition.update({
      where: { id: conditionId },
      data: dto,
      omit: omitPartnerId,
    });
    await this.invalidate();
    return result;
  }

  async removeCondition(conditionId: string) {
    await this.findConditionOrFail(conditionId);
    await this.prisma.partnerCondition.delete({ where: { id: conditionId } });
    await this.invalidate();
    return { message: 'Condition deleted' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findOneOrFail(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
      include: includeNested,
    });
    if (!partner) throw new NotFoundException(`Partner #${id} not found`);
    return partner;
  }

  private async findConditionOrFail(id: string) {
    const condition = await this.prisma.partnerCondition.findUnique({
      where: { id },
    });
    if (!condition) throw new NotFoundException(`Condition #${id} not found`);
    return condition;
  }
}
