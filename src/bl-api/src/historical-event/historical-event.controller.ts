import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistoricalEventService } from './historical-event.service';
import { CreateHistoricalEventDto } from './dto/create-historical-event.dto';
import { UpdateHistoricalEventDto } from './dto/update-historical-event.dto';

@Controller('historical-event')
export class HistoricalEventController {
  constructor(
    private readonly historicalEventService: HistoricalEventService,
  ) {}

  @Post()
  create(@Body() createHistoricalEventDto: CreateHistoricalEventDto) {
    console.log('Received POST request:', createHistoricalEventDto); // Log para depuração
    return this.historicalEventService.create(createHistoricalEventDto);
  }

  @Get()
  findAll() {
    return this.historicalEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicalEventService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistoricalEventDto: UpdateHistoricalEventDto,
  ) {
    return this.historicalEventService.update(+id, updateHistoricalEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicalEventService.remove(+id);
  }
}
