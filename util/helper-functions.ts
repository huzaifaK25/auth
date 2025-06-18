import { HttpException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

export function catchError(error: any) {
    // custom error def
    const customError = error as {message?: string, status?:number};
    const message = customError?.message || 'Internal server error';
    const status = customError?.status || 500;
    throw new HttpException(message, status);
}

export function removePassword(user: User | any) {
    // const {name: userName, email: userEmail, age: userAge, occupation: userOccupation} = user
    // const userData = {userName, userEmail, userAge, userOccupation}
    // return userData
    const {password, ...userData} = user;
    return userData; 
}
