import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signIn.dto';
import { signUpDto } from './dto/signUp.dto';
import { Public } from './decorator/public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  @Public()
  @HttpCode(200)
  async signIn(@Body() signInDto: signInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Post("signup")
  @Public()
  async signUp(@Body() signUpDto: signUpDto) {
    return this.authService.signUp(signUpDto)
  }
}
