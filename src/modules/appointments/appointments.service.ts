import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApointmentDto } from 'src/modules/appointments/dtos/create-appointment.dto';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';
import { catchError } from '../../../util/helper-functions';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
  ) {}

  // create new appointment by doctor and patient
  async createAppointment(
    doctor_id: number,
    patient_id: number,
    dto: CreateApointmentDto,
  ) {
    try {
      // gets private user repository from UserService
      const usersRepo = this.usersService.getUsersRepo();

      // find doctor entity
      const doctor = await usersRepo.findOne({
        where: {
          id: doctor_id,
        },
        relations: ['doctor_detail'],
      });

      // find user entity
      const patient = await usersRepo.findOne({
        where: {
          id: patient_id,
        },
        relations: ['patient_detail'],
      });
      //console.log({doctor, patient})

      // create appointment entity
      const appt = this.appointmentsRepository.create({
        ...dto,
        appt_date: dto.appt_date,
        appt_time: dto.appt_time,
        appt_status: dto.appt_status,
        patient_complaint: dto.patient_complaint,
        doctor_detail: doctor?.doctor_detail,
        patient_detail: patient?.patient_detail,
      });
      const apptEntity = await this.appointmentsRepository.save(appt);

      if (apptEntity) return { message: 'Appointment Created', apptEntity };
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    } catch (error) {
      catchError(error);
    }
  }

  // get all appointments of a specific doctor
  async getAppointmentsByDoctor(id: number) {
    try {
      // gets private user repository from UserService
      const usersRepo = this.usersService.getUsersRepo();
      const user = await usersRepo.findOne({
        where: {
          doctor_detail: {
            id,
          },
        },
        relations: {
          doctor_detail: true,
        },
      });

      const appts = await this.appointmentsRepository.find({
        where: {
          doctor_detail: {
            id,
          },
        },
      });

      if (appts)
        return {
          profile: user,
          message: `Here are all your appointments`,
          appts,
        };
      throw new HttpException('No appointments found', HttpStatus.NOT_FOUND);
    } catch (error) {
      catchError(error);
    }
  }

  //get all appointments of a specific patient
  async getAppointmentsByPatient(id: number) {
    try {
      // gets private user repository from UserService
      const usersRepo = this.usersService.getUsersRepo();
      const user = await usersRepo.findOne({
        where: {
          patient_detail: {
            id,
          },
        },
        relations: {
          patient_detail: true,
        },
      });

      //const user = await usersRepo.findOne({where: {id}})
      const appts = await this.appointmentsRepository.find({
        where: {
          patient_detail: {
            id,
          },
        },
      });

      if (appts)
        return {
          profile: user,
          message: `Here are all your appointments`,
          appts,
        };
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    } catch (error) {}
  }
}
