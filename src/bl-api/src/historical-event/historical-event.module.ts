import { Module } from '@nestjs/common';
import { HistoricalEventService } from './historical-event.service';
import { HistoricalEventController } from './historical-event.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [HistoricalEventController],
  providers: [HistoricalEventService, PrismaService],
})
export class HistoricalEventModule {}
