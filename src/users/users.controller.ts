import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('sign-up')
    register(@Body() body: CreateUserDto) {
        return this.usersService.signUp(body)
    }

    @Post('log-in')
    login(@Body() body: { email: string, password: string }) {
        return this.usersService.login(body.email, body.password)
    }

    @Get('me')
    getProfile(@Body() body: {email: string}) {
        return this.usersService.getProfile(body.email)
    }

    @Get(':id')
    findOne(@Param() param: {id: number}) {
        return this.usersService.findOne(param.id)
    }

    @Patch('update')
    updateUser(@Body() body: CreateUserDto) {
        return this.usersService.updateUser(body)
    }

    @Delete('delete') 
    deleteUser(@Body() body: {email: string}) {
        return this.usersService.deleteUser(body.email)
    }
}
