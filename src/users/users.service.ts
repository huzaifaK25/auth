import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    private readonly jwtService : JwtService) {}
  
    // SIGN_UP METHOD
    async signUp(dto: CreateUserDto) {
      try {
        // Checking if user already exists
        const userExists = await this.usersRepository.findOne({where: {email: dto.email}})
        if (userExists) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
  
        // Hashing password
        const salt = await genSalt(12);
        const hashPassword = await hash(dto.password, salt);
  
        // Creating user entity
        // destructures dto and assigns same name values
        const { name, email, age, occupation, password  } = dto;
        // replaces PW with hashPW
        const user = this.usersRepository.create({
          name,
          age,
          email,
          occupation,
          password: hashPassword
        });
        // Saving new user in db 
        const userEntity = await this.usersRepository.save(user);
  
        // Returning response to user (message + user data)
        return { message: 'Your account has beed created', user: userEntity };
        
      } catch (error) {
        // Custom error definition standard
        const customError = error as {message?: string, status?: number};
        const message = customError?.message || 'Internal server error';
        const status = customError?.status || 500;
        throw new HttpException(message, status);
      }
  }

  // LOG-IN METHOD
  async login(email: string, password: string) {
    try {
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
      
    } catch (error) {
      const customError = error as {message?: string, status?: number};
      const message = customError?.message || 'Internal server error';
      const status = customError?.status || 500;
      throw new HttpException(message, status);
    }
      
  }

  async getProfile(request: any) {
    try {
      const email = request.user.username.email;
      
      const userExists = await this.usersRepository.findOne({where: {email}})
      if (!userExists) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

      // removes password to display users data
      const userData = this.removePassword(userExists)
      return {message:'Your profile:', user: userData}
      
    } catch (error) {
      const customError = error as {message?: string, status?: number};
      const message = customError?.message || 'Internal server error';
      const status = customError?.status || 500;
      throw new HttpException(message, status);
    }
  }
   
  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({where: {id}})
  
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
  
      const userData = this.removePassword(user);
      return {message: 'User found!', userData}
      
    } catch (error) {
      const customError = error as {message?: string, status?: number};
      const message = customError?.message || 'Internal server error';
      const status = customError?.status || 500;
      throw new HttpException(message, status);
    }
  }

  async findWhere(occupation: string, age: number) {
    try {
      const user = await this.usersRepository.find({where: {occupation, age}})

      if (user) return {message: 'Users with this occupation and age', user}

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST)
      
    } catch (error) {
      const customError = error as {message?: string, status?: number};
      const message = customError?.message || 'Internal server error';
      const status = customError?.status || 500;
      throw new HttpException(message, status);
    }
  }

  async updateUser(body: UpdateUserDto, req: any) {
    try {
      const id = req.user.username.id
      const result = await this.usersRepository.update({id}, {
        // {...(condition && { name: body.name })} = name if cond true 
        ...(body.name && { name: body.name}), 
        ...(body.age && { age: body.age}),
        ...(body.occupation && { occupation: body.occupation}),
      })
      // checks if DB updated or not
      if (result.affected) return {message: 'User updated:'}
      
      // throws error if something still goes wrong even with valid fields
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    } catch (error) {
      const customError = error as { message?: string, status?: number };
      const message = customError?.message || 'Internal server error';
      const status = customError?.status || 500;
      throw new HttpException(message, status);
    }
    
  }

  async deleteUser(email: string) {
    try {
      // check if user exists
      const userExists = await this.usersRepository.findOne({where: {email}})
      if (!userExists) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

      // deletes user from database
      await this.usersRepository.remove(userExists)
      return {message: `The user with email: ${email} has been successfully deleted`}    
      
    } catch (error) {
      const customError = error as {message?: string, status?: number};
      const message  = customError?.message || 'Internal server error'
      const status = customError?.status || 500;
      throw new HttpException(message, status);
    }
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