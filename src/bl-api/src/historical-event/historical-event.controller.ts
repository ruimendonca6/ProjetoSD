/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { HistoricalEventService } from './historical-event.service';
import { CreateHistoricalEventDto } from './dto/create-historical-event.dto';
import { UpdateHistoricalEventDto } from './dto/update-historical-event.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from '../auth/role.decorator';

@Controller('historical-event')
@UseGuards(AuthGuard)
export class HistoricalEventController {
  constructor(
    private readonly historicalEventService: HistoricalEventService,
  ) {}

  @Roles('Admin', 'Edit')
  @Post()
  async create(
    @Res() response: Response,
    @Body() createHistoricalEventDto: CreateHistoricalEventDto,
  ) {
    console.log('Received POST request:', createHistoricalEventDto);
    try {
      const newEvent = await this.historicalEventService.create(
        createHistoricalEventDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Historical event created successfully',
        newEvent,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error creating historical event',
        error: errorMessage,
      });
    }
  }
  @Roles('View', 'Admin', 'Edit')
  @Get()
  async findAll(@Res() response: Response) {
    try {
      const events = await this.historicalEventService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All historical events retrieved successfully',
        events,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error retrieving historical events',
        error: errorMessage,
      });
    }
  }

  @Roles('View', 'Admin', 'Edit')
  @Get(':id')
  async findOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const event = await this.historicalEventService.findOne(+id);
      if (!event) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Historical event not found',
        });
      }
      return response.status(HttpStatus.OK).json({
        message: 'Historical event retrieved successfully',
        event,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error retrieving historical event',
        error: errorMessage,
      });
    }
  }

  @Roles('Admin', 'Edit')
  @Put(':id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateHistoricalEventDto: UpdateHistoricalEventDto,
  ) {
    try {
      const updatedEvent = await this.historicalEventService.update(
        +id,
        updateHistoricalEventDto,
      );
      if (!updatedEvent) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Historical event not found',
        });
      }
      return response.status(HttpStatus.OK).json({
        message: 'Historical event updated successfully',
        updatedEvent,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error updating historical event',
        error: errorMessage,
      });
    }
  }
  @Roles('Admin')
  @Delete(':id')
  async remove(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedEvent = await this.historicalEventService.remove(+id);
      if (!deletedEvent) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Historical event not found',
        });
      }
      return response.status(HttpStatus.OK).json({
        message: 'Historical event deleted successfully',
        deletedEvent,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error deleting historical event',
        error: errorMessage,
      });
    }
  }
}
