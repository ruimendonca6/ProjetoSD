/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateHistoricalEventDto } from './dto/create-historical-event.dto';
import { UpdateHistoricalEventDto } from './dto/update-historical-event.dto';

@Injectable()
export class HistoricalEventService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHistoricalEventDto) {
    console.log('Creating Historical Event:', data);
    return this.prisma.historicalEvent.create({ data });
  }

  async findAll() {
    return this.prisma.historicalEvent.findMany();
  }

  async findOne(id: number) {
    return this.prisma.historicalEvent.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateHistoricalEventDto) {
    return this.prisma.historicalEvent.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.historicalEvent.delete({ where: { id } });
  }
}
