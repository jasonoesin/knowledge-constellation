// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: { username: string, password: string }): Promise<{ message: string }> {
    const username = body.username;
    const password = body.password;

    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('Username is already taken');
    }

    await this.authService.registerUser(username, password);

    return { message: 'User registered successfully' };
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
