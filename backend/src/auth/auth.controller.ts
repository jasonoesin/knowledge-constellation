import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpException, HttpStatus, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Response, response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,

  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { username: string, password: string }, @Res() res: Response): Promise<any> {
    const username = body.username;
    const password = body.password;

    const data = await this.authService.registerUser(username, password);

    return res.json({
      message: 'Register successful',
      success: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { username: string, password: string }, @Res() res: Response): Promise<any> {
    const username = body.username;
    const password = body.password;

    const data = await this.authService.loginUser(username, password);

    res.cookie('token', data.access_token, { httpOnly: true, path: "/"});

    return res.json({
      message: 'Login successful',
      success: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {  
    res.cookie('token', '', { httpOnly: true,path: "/", expires: new Date(0) });

    return res.json({
      message: 'Logout successful',
      success: true,
    });
  }

}
