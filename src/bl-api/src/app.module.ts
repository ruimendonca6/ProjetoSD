/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoricalEventModule } from './historical-event/historical-event.module';

@Module({
  imports: [HistoricalEventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
