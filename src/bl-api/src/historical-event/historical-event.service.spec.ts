import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalEventService } from './historical-event.service';

describe('HistoricalEventService', () => {
  let service: HistoricalEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricalEventService],
    }).compile();

    service = module.get<HistoricalEventService>(HistoricalEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
