import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

@Controller()
export class AppController {
  //constructor(private authService: AuthService) {}

  // @Post('auth/signup')
  // signUp(@Body() body: {}) {}

  // @Post('auth/login')
  // async login(@Body() body: { username?: string, password?: string }) {
  //   return this.authService.login(body?.username);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
