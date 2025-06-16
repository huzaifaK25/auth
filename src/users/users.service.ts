import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

// This should be a real class/interface representing a user entity
//export type User = any;

@Injectable()
export class UsersService {

  name: string | undefined;  
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>) {}
  
  async signUp(dto: CreateUserDto) {

    //#region  Checking if user already exists
    const userExists = await this.usersRepository.findOne({where: {email: dto.email}})
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }
    ////#endregion


    // Hashing password
    const salt = await genSalt(12);
    const hashPassword = await hash(dto.password, salt);

    console.log({ hashPassword });

    // Creating user entity
    // const user = this.usersRepository.create({
    //   name: dto.name,
    //   age: dto.age,
    //   email: dto.email,
    //   occupation: dto.occupation,
    //   password: dto.password,
    //   password: hashPassword
    // });

    // const user = this.usersRepository.create({...dto, password: hashPassword})

    const { name, email, age, occupation, password  } = dto;

    const user = this.usersRepository.create({
      name,
      age,
      email,
      occupation,
      password: hashPassword
    });


    // Saving new user in db
    const userEntity = await this.usersRepository.save(user);

    console.log({ userEntity });
    
    // Returning response to user
    return { message: 'Your account has beed created', user: userEntity };
  }

  async findOne(username: string) {
    return [];
    // return this.usersRepository.find((user) => user.username === username);
  }
}


// private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];
