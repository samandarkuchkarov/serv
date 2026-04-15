import { Module } from '@nestjs/common';
import { ConstructorController } from './constructor.controller';
import { ConstructorService } from './constructor.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ConstructorController],
  providers: [ConstructorService, PrismaService],
})
export class ConstructorModule {}
