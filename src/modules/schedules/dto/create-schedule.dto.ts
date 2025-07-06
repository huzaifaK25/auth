import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsString()
  sched_day: string;

  @IsNotEmpty()
  @IsString()
  time_from: Date;

  @IsNotEmpty()
  @IsString()
  time_to: Date;
}
