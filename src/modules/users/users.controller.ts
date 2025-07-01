import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { Role } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all-doctors')
  getAll() {
    return this.usersService.getAllDoctors();
  }

  @Post('sign-up')
  register(@Body() body: CreateUserDto) {
    return this.usersService.signUp(body);
  }

  @Post('doctor/sign-up')
  registerDoctor(@Body() body: CreateDoctorDto) {
    return this.usersService.signUpDoctor(body);
  }

  @Post('patient/sign-up')
  registerPatient(@Body() body: CreatePatientDto) {
    return this.usersService.signUpPatient(body);
  }

  @Get('doctor')
  getDoctor(
    @Query()
    query: {
      specialization?: string;
      yearsOfExp?: number;
      rating?: number;
    },
  ) {
    return this.usersService.getDoctors(query);
  }

  @Get('patient')
  getPatient(@Query() query: { contact_number?: number }) {
    return this.usersService.getPatient(query);
  }

  @Post('log-in')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard) // Checks JWT here directly
  @Get('me')
  getProfile(@Req() req: Request) {
    return this.usersService.getProfile(req);
  }

  @Get(':id')
  findOne(@Param('id') param: { id: number }) {
    return this.usersService.findOne(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findWhere(@Query('role') role: Role) {
    return this.usersService.findWhere(role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
    return this.usersService.updateUser(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  deleteUser(@Body() body: { email: string }) {
    return this.usersService.deleteUser(body.email);
  }
}
