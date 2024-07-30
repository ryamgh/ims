import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { log } from 'console';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login (@Body() LoginDto: LoginDto): Promise<{ token: string}>{
    return this. authService.login(LoginDto)
  }
}
