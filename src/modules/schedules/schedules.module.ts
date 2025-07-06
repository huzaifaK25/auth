import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { SchedulesController } from './schedule.controller';
import { SchedulesService } from './schedule.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, User, Doctor, Patient])],
  controllers: [SchedulesController],
  providers: [SchedulesService, UsersService, JwtService],
})
export class SchedulesModule {}
