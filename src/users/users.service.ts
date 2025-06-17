import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import * as bcrypt from 'bcrypt';
import { log } from 'node:console';
import { Http2ServerRequest } from 'node:http2';
import { JwtService } from '@nestjs/jwt';
import { request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

// This should be a real class/interface representing a user entity
//export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    private readonly jwtService : JwtService) {}
  
    // SIGN_UP METHOD
    async signUp(dto: CreateUserDto) {
    //#region  Checking if user already exists
    const userExists = await this.usersRepository.findOne({where: {email: dto.email}})
    //console.log(userExists);
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }
    ////#endregion

    // Hashing password
    const salt = await genSalt(12);
    const hashPassword = await hash(dto.password, salt);
    //console.log({ hashPassword });

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

    // destructures dto and assigns same name values
    const { name, email, age, occupation, password  } = dto;
    // only creates an instance or user acc to dto
    const user = this.usersRepository.create({
      name,
      age,
      email,
      occupation,
      password: hashPassword
    });

    // Saving new user in db 
    const userEntity = await this.usersRepository.save(user);
    //console.log({ userEntity });
    
    // Returning response to user (message + user data)
    return { message: 'Your account has beed created', user: userEntity };
  }

  // LOG-IN METHOD
  async login(email: string, password: string) {
    
    // check if user exisit already or not
    const userExists = await this.usersRepository.findOne({where: {email}}); 
    // error if user does not exist
    if (!userExists) throw new HttpException('Please sign-in first', HttpStatus.NOT_FOUND)
    
    // check if user entered correct password
    const isMatch = await bcrypt.compare(password, userExists.password)
    // login success response if password correct
    if (isMatch) {
      // create JWT token for logged in user
      const payload = {username: userExists, sub: Math.floor(Math.random() * 10000)}
      const access_token = await this.jwtService.signAsync(payload)
      return {message: 'Logged in successfully', access_token}
    }
    // login failed response if password incorrect
    throw new HttpException('Password incorrect', HttpStatus.FORBIDDEN)
      
  }

  async getProfile(request: any) {
    //console.log(request.user)
    const email = request.user.username.email;
    
    const userExists = await this.usersRepository.findOne({where: {email}})
    if (!userExists) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    // removes password to display users data
    const userData = this.removePassword(userExists)
    
    return {message:'Your profile:', user: userData}
  }
   
  async findOne(id: number) {
    //console.log({id});
    const user = await this.usersRepository.findOne({where: {id}})

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    const userData = this.removePassword(user);

    return {message: 'User found!', userData}
  }

  async findWhere(occupation: string, age: number) {
    const user = await this.usersRepository.find({where: {occupation, age}})
    return {message: 'Users with this occupation and age', user}
  }

  async updateUser(body: UpdateUserDto, req: any) {
    //const user = await this.usersRepository.findOne({where: {id}})
    //await this.usersRepository.update(user, body)
    //console.log(userUpdate);
    //const updatedUser = this.removePassword(user)
    console.log(body);
    
    const id = req.user.username.id
    await this.usersRepository.update({id}, {
      ...(body.name && { name: body.name}), // ...{ name: body.name } = name, ...(condition &&)  
      ...(body.age && { age: body.age}),
      ...(body.occupation && { occupation: body.occupation}),
    })
    return {message: 'User updated:'} 
  }

  async deleteUser(email: string) {
    // check if user exists
    const userExists = await this.usersRepository.findOne({where: {email}})
    if (!userExists) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    // deletes user from database
    await this.usersRepository.remove(userExists)
    return {message: `The user with email: ${email} has been successfully deleted`}    
  }

  // removes password to display data
  removePassword(user: User | any) {
    // const {name: userName, email: userEmail, age: userAge, occupation: userOccupation} = user
    // const userData = {userName, userEmail, userAge, userOccupation}
    // return userData
    const {password, ...userData} = user;
    return userData;
  }
}