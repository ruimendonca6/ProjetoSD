import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoricalEventService } from './historical-event/historical-event.service';
import { HistoricalEventController } from './historical-event/historical-event.controller';
import { HistoricalEventModule } from './historical-event/historical-event.module';

@Module({
  imports: [HistoricalEventModule],
  controllers: [AppController, HistoricalEventController],
  providers: [AppService, HistoricalEventService],
})
export class AppModule {}
