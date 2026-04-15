import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('vacancies')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get()
  getPublic() {
    return this.vacancyService.getPublic();
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.vacancyService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.vacancyService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateVacancyDto) {
    return this.vacancyService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVacancyDto) {
    return this.vacancyService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacancyService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.vacancyService.toggleVisibility(id);
  }

  // ─── Conditions ───────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(':id/conditions')
  createCondition(@Param('id') id: string, @Body() dto: CreateConditionDto) {
    return this.vacancyService.createCondition(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('conditions/:conditionId')
  updateCondition(
    @Param('conditionId') conditionId: string,
    @Body() dto: UpdateConditionDto,
  ) {
    return this.vacancyService.updateCondition(conditionId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('conditions/:conditionId')
  removeCondition(@Param('conditionId') conditionId: string) {
    return this.vacancyService.removeCondition(conditionId);
  }

  // ─── Requirements ─────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(':id/requirements')
  createRequirement(@Param('id') id: string, @Body() dto: CreateRequirementDto) {
    return this.vacancyService.createRequirement(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('requirements/:requirementId')
  updateRequirement(
    @Param('requirementId') requirementId: string,
    @Body() dto: UpdateRequirementDto,
  ) {
    return this.vacancyService.updateRequirement(requirementId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('requirements/:requirementId')
  removeRequirement(@Param('requirementId') requirementId: string) {
    return this.vacancyService.removeRequirement(requirementId);
  }
}
