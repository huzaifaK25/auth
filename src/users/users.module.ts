import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Doctor } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment } from 'src/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, Patient, Appointment]), 
    JwtModule.register({
      secret: jwtConstants.secret, // secret key for JWT
      signOptions: {
        expiresIn: '1d' // expiry time fopr JWT
      }
    })
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
