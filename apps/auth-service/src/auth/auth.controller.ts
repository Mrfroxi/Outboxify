import { Body, Controller, Get, Post, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { SignUpDto, LoginDto } from '@app/contracts';
import { JwtAuthGuard, CurrentUser } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user: { id: string; email: string }) {
    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Res() res: Response) {
    const user = res.req.user as { accessToken: string };
    res.redirect(`/api/auth/oauth-success?token=${user.accessToken}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Res() res: Response) {
    const user = res.req.user as { accessToken: string };
    res.redirect(`/api/auth/oauth-success?token=${user.accessToken}`);
  }
}
