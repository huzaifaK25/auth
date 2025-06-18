import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Role } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('doctor/sign-up')
    registerDoctor(@Body() body: CreateDoctorDto) {
        return this.usersService.createDoctor(body)
    }
    @Post('patient/sign-up')
    registerPatient(@Body() body: CreatePatientDto) {
        return this.usersService.createPatient(body)
    }

    @Post('sign-up')
    register(@Body() body: CreateUserDto) {
        return this.usersService.signUp(body)
    }

    @Post('log-in')
    login(@Body() body: { email: string, password: string }) {
        return this.usersService.login(body.email, body.password)
    }

    @UseGuards(JwtAuthGuard) // Checks JWT here directly
    @Get('me')
    getProfile(@Req() req: Request) {
        return this.usersService.getProfile(req)
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') param: {id: number}) {
        return this.usersService.findOne(param.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findWhere(@Query('role') role: Role) {
        return this.usersService.findWhere(role)
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('update')
    updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
        
        return this.usersService.updateUser(body, req)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete') 
    deleteUser(@Body() body: {email: string}) {
        return this.usersService.deleteUser(body.email)
    } 

}
