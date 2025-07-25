
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class PartialCreateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends OmitType(PartialCreateUserDto, ['email'] as const) {
    
}

