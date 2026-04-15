import { Module } from '@nestjs/common';
import { AdvantageController } from './advantage.controller';
import { AdvantageService } from './advantage.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [AdvantageController],
  providers: [AdvantageService, PrismaService],
})
export class AdvantageModule {}
