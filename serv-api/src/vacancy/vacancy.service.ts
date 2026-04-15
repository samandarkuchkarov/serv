import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';

const KEYS = { public: 'vacancies:public', all: 'vacancies:all' };

const omitVacancyId = { vacancy_id: true } as const;

const includeNested = {
  conditions: {
    orderBy: { created_at: 'asc' as const },
    omit: omitVacancyId,
  },
  requirements: {
    orderBy: { created_at: 'asc' as const },
    omit: omitVacancyId,
  },
};

@Injectable()
export class VacancyService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getPublic() {
    const cached = await this.cache.get(KEYS.public);
    if (cached) return cached;
    const data = await this.prisma.vacancy.findMany({
      where: { is_visible: true },
      include: includeNested,
      orderBy: { created_at: 'desc' },
    });
    await this.cache.set(KEYS.public, data);
    return data;
  }

  async getAll() {
    const cached = await this.cache.get(KEYS.all);
    if (cached) return cached;
    const data = await this.prisma.vacancy.findMany({
      include: includeNested,
      orderBy: { created_at: 'desc' },
    });
    await this.cache.set(KEYS.all, data);
    return data;
  }

  getOne(id: string) {
    return this.findOneOrFail(id);
  }

  // ─── Vacancy CRUD ─────────────────────────────────────────────────────────

  async create(dto: CreateVacancyDto) {
    const result = await this.prisma.vacancy.create({
      data: dto,
      include: includeNested,
    });
    await this.invalidate();
    return result;
  }

  async update(id: string, dto: UpdateVacancyDto) {
    await this.findOneOrFail(id);
    const result = await this.prisma.vacancy.update({
      where: { id },
      data: dto,
      include: includeNested,
    });
    await this.invalidate();
    return result;
  }

  async remove(id: string) {
    await this.findOneOrFail(id);
    await this.prisma.vacancy.delete({ where: { id } });
    await this.invalidate();
    return { message: 'Vacancy deleted' };
  }

  async toggleVisibility(id: string) {
    const vacancy = await this.findOneOrFail(id);
    const result = await this.prisma.vacancy.update({
      where: { id },
      data: { is_visible: !vacancy.is_visible },
      include: includeNested,
    });
    await this.invalidate();
    return result;
  }

  async createCondition(vacancy_id: string, dto: CreateConditionDto) {
    await this.findOneOrFail(vacancy_id);
    const result = await this.prisma.vacancyCondition.create({
      data: { ...dto, vacancy_id },
      omit: omitVacancyId,
    });
    await this.invalidate();
    return result;
  }

  async updateCondition(conditionId: string, dto: UpdateConditionDto) {
    await this.findConditionOrFail(conditionId);
    const result = await this.prisma.vacancyCondition.update({
      where: { id: conditionId },
      data: dto,
      omit: omitVacancyId,
    });
    await this.invalidate();
    return result;
  }

  async removeCondition(conditionId: string) {
    await this.findConditionOrFail(conditionId);
    await this.prisma.vacancyCondition.delete({ where: { id: conditionId } });
    await this.invalidate();
    return { message: 'Condition deleted' };
  }

  // ─── Requirements ─────────────────────────────────────────────────────────

  async createRequirement(vacancy_id: string, dto: CreateRequirementDto) {
    await this.findOneOrFail(vacancy_id);
    const result = await this.prisma.vacancyRequirement.create({
      data: { ...dto, vacancy_id },
      omit: omitVacancyId,
    });
    await this.invalidate();
    return result;
  }

  async updateRequirement(requirementId: string, dto: UpdateRequirementDto) {
    await this.findRequirementOrFail(requirementId);
    const result = await this.prisma.vacancyRequirement.update({
      where: { id: requirementId },
      data: dto,
      omit: omitVacancyId,
    });
    await this.invalidate();
    return result;
  }

  async removeRequirement(requirementId: string) {
    await this.findRequirementOrFail(requirementId);
    await this.prisma.vacancyRequirement.delete({
      where: { id: requirementId },
    });
    await this.invalidate();
    return { message: 'Requirement deleted' };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async invalidate() {
    await Promise.all([this.cache.del(KEYS.public), this.cache.del(KEYS.all)]);
  }

  private async findOneOrFail(id: string) {
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id },
      include: includeNested,
    });
    if (!vacancy) throw new NotFoundException(`Vacancy #${id} not found`);
    return vacancy;
  }

  private async findConditionOrFail(id: string) {
    const condition = await this.prisma.vacancyCondition.findUnique({
      where: { id },
    });
    if (!condition) throw new NotFoundException(`Condition #${id} not found`);
    return condition;
  }

  private async findRequirementOrFail(id: string) {
    const requirement = await this.prisma.vacancyRequirement.findUnique({
      where: { id },
    });
    if (!requirement)
      throw new NotFoundException(`Requirement #${id} not found`);
    return requirement;
  }
}
