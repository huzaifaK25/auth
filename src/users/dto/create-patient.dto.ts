import { IsNotEmpty, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";


export class CreatePatientDto extends CreateUserDto {

    @IsNotEmpty()
    @IsString()
    contact_number: number
}




