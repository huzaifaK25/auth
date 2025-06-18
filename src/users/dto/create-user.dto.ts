import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

enum Role {
    PATIENT = 'patient',
    DOCTOR = 'doctor'
}


export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    role: Role;
}