import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateApointmentDto } from 'src/dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsSerivce: AppointmentsService) {}

    @Post('create')
    createAppointment(@Body() body : {doctor_id: number, patient_id: number, dto:CreateApointmentDto}) {
        return this.appointmentsSerivce.createAppointment(body.doctor_id, body.patient_id, body.dto)
    }

    @Get('doctor')
    getDoctorAppointment(@Query('id') id: number) {
        return this.appointmentsSerivce.getAppointmentsByDoctor(id)
    }

    @Get('patient')
    getPatientAppointmentP(@Query('id') id: number) {
        return this.appointmentsSerivce.getAppointmentsByPatient(id)
    }

}
