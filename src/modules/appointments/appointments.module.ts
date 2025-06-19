import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Doctor } from 'src/modules/users/entities/doctor.entity';
import { Patient } from 'src/modules/users/entities/patient.entity';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Doctor, Patient])
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, UsersService, JwtService]
})
export class AppointmentsModule {}
