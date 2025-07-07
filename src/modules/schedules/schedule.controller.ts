import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('create')
  createSchedule(@Body() body: { doctor_id: number; dto: CreateScheduleDto }) {
    return this.schedulesService.createSchedule(body.doctor_id, body.dto);
  }

  // TODO: add auth guard
  @Get('get')
  getSchedule(@Query('id', ParseIntPipe) id: number) {
    return this.schedulesService.getSchedule(id);
  }
  // TODO: UPDATE SCHEDULE and DELETE SCHEDULE
}
