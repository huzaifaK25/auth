import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { catchError } from 'util/helper-functions';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  async getSchedule(doctor_id: number) {
    try {
      const schedule = await this.schedulesRepository.find({
        where: {
          doctor_id,
        },
      });

      if (schedule) return { message: 'Schedule:', schedule };
    } catch (error) {
      catchError(error);
    }
  }

  async createSchedule(doctor_id: number, dto: CreateScheduleDto) {
    try {
      const sched = this.schedulesRepository.create({
        doctor_id,
        sched_day: dto.sched_day,
        time_from: dto.time_from,
        time_to: dto.time_to,
      });

      const schedule = await this.schedulesRepository.save(sched);

      if (schedule) return { message: 'Created Schedule:', schedule };
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    } catch (error) {
      catchError(error);
    }
  }
}
