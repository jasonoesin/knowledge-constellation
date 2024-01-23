// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string, password: string }): Promise<{ message: string, data: Object }> {
    const username = body.username;
    const password = body.password;

    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
    }

    const data = await this.authService.registerUser(username, password);

    return { message: 'User registered successfully', data : data };
  }

//   @Post('login')
//   @HttpCode(200)
//   async login(@Body() body: { username: string, password: string }): Promise<{ token: string }> {
//     const { username, password } = body;

//     const user = await this.authService.validateUser(username, password);
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const token = await this.authService.generateToken(user);
//     return { token };
//   }
}
