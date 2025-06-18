import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { catchError, removePassword } from 'util/helper-functions';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { dot } from 'node:test/reporters';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Doctor) 
    private readonly doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    private readonly jwtService : JwtService
  ) {}

  //**********************************API METHODS**********************************//

  async createDoctor(dto: CreateDoctorDto) {
    try {
      const userExists = await this.usersRepository.findOne({where: {email: dto.email}})
      if (userExists) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
      
      const salt = await genSalt(12);
      const hashPassword = await hash(dto.password, salt)

      // User entity object created
      const user = this.usersRepository.create({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        password: hashPassword,

      }) 
      // User entity is saved in db 
      await this.usersRepository.save(user) 
      const doctor = await this.createDoctorProfile(dto, user)
      return {message: 'Doctor profile has been created', user, doctor}

    } catch (error) {
      catchError(error)
    }
  }

  async createPatient(dto: CreatePatientDto) {
    try {
      const userExists = await this.usersRepository.findOne({where: {email: dto.email}})
      if (userExists) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
  
      const salt = await genSalt(12);
      const hashPassword = await hash(dto.password, salt)
      const user = this.usersRepository.create({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        password: hashPassword,
      })
      await this.usersRepository.save(user)
      const patient = await this.createPatientProfile(dto, user)
      return {message: 'Patient profile has been created', user, patient}
      
    } catch (error) {
      catchError(error)
    }
  }

  // SIGN_UP METHOD
  async signUp(dto: CreateUserDto) {
    try {
      // Checking if user already exists
      const userExists = await this.usersRepository.findOne({where: {email: dto.email}})
      if (userExists) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)

      // Hashing password
      const salt = await genSalt(12);
      const hashPassword = await hash(dto.password, salt);

      // Creating user entity object
      const user = this.usersRepository.create({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        password: hashPassword
      });
      // Saving new user in db 
      const userEntity = await this.usersRepository.save(user);

      // Returning response to user (message + user data)
      return { message: 'Your account has beed created', user: userEntity };
      
    } catch (error) {
      catchError(error);
    }
  }

  // LOG-IN METHOD
  async login(email: string, password: string) {
    try {
      // check if user exisit already or not
      const userExists = await this.usersRepository.findOne({where: {email}}); 
      if (!userExists) throw new HttpException('Please sign-in first', HttpStatus.NOT_FOUND)
      
      // check if user entered correct password
      const isMatch = await bcrypt.compare(password, userExists.password)
      if (isMatch) {
        // create JWT token for logged in user
        const payload = {username: userExists, sub: Math.floor(Math.random() * 10000)}
        const access_token = await this.jwtService.signAsync(payload)
        return {message: 'Logged in successfully', access_token}
      }
      // login failed response if password incorrect
      throw new HttpException('Password incorrect', HttpStatus.FORBIDDEN)
      
    } catch (error) {
      catchError(error);
    }
      
  }
  
  async getProfile(request: any) {
    try {
      const email = request.user.username.email;
      
      const userExists = await this.usersRepository.findOne({where: {email}})
      if (!userExists) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

      // removes password to display users data
      const userData = removePassword(userExists)
      return {message:'Your profile:', user: userData}
      
    } catch (error) {
      catchError(error);
    }
  }
   
  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({where: {id}})
  
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      
      const userData = removePassword(user);
      return {message: 'User found!', userData}
      
    } catch (error) {
      catchError(error);
    }
  }

  async findWhere(role: Role) {
    try {
      const user = await this.usersRepository.findOne({where: {role}})
      
      if (user) return {message: 'Users with this occupation and age', user}

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST)
      
    } catch (error) {
      catchError(error);
    }
  }
  
  async updateUser(body: UpdateUserDto, req: any) {
    try {
      const id = req.user.username.id
      const result = await this.usersRepository.update({id}, {
        // {...(condition && { name: body.name })} = name if cond true 
        ...(body.name && { name: body.name}),
        ...(body.password && { password: body.password}) 
      })
      // checks if DB updated or not
      if (result.affected) return {message: 'User updated:'}
      
      // throws error if something still goes wrong even with valid fields
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    } catch (error) {
      catchError(error);
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
      catchError(error)
    }
  } 

  //**********************************PRIVATE METHODS**********************************//

  // creates a Doctor User Profile
  private async createDoctorProfile(dto: CreateDoctorDto, user: User) {
    // Doctor detail entity object created
    const doctorDetail = this.doctorsRepository.create({
      introduction: dto.introduction,
      rating: dto.rating,
      specialization: dto.specialization,
      yearsOfExp: dto.yearsOfExperience, 
      user_id: user.id
    }) 
    // Docter detail saved if user entity is also saved in db
    const doctorEntity = await this.doctorsRepository.save(doctorDetail)  
    return doctorEntity
  }

  // creates a Patient User Profile 
  private async createPatientProfile(pdto: CreatePatientDto, user: User) {
    const patientDetail = this.patientsRepository.create({
      contact_number: pdto.contact_number,
      user_id: user.id
    })
    const patientEntity = await this.patientsRepository.save(patientDetail)
    return patientEntity
  }
}