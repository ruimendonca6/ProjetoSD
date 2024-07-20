import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoricalEventModule } from './historical-event/historical-event.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HistoricalEventModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
