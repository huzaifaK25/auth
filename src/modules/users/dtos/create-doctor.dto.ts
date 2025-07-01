import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class CreateDoctorDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsNumber()
  yearsOfExperience: number;

  @IsNumber()
  rating: number;

  @IsString()
  introduction: string;
}
