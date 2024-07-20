import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalEventController } from './historical-event.controller';

describe('HistoricalEventController', () => {
  let controller: HistoricalEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricalEventController],
    }).compile();

    controller = module.get<HistoricalEventController>(
      HistoricalEventController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
