import { Status } from "../entities/appointment.entity"
import { IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator"


export class CreateApointmentDto {

    @IsNotEmpty()
    @IsDateString()
    appt_date: Date

    @IsNotEmpty()
    @IsString()
    appt_time: Date

    @IsNotEmpty()
    @IsString()
    appt_status: Status

    @IsNotEmpty()
    @IsString()
    patient_complaint: string
}