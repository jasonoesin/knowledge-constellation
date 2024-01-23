import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Neo4jService } from '../neo4j/neo4j.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
    return user;
    }

    return null;
  }
  
  async registerUser(username: string, password: string): Promise<any> {
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      return new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.registerUser(username, hashedPassword);

    const payload = { sub: user.username};

    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
    };
  }

  async loginUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
    }

    const isValidCredentials = await this.validateUser(username, password);

    if (!isValidCredentials) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload = { sub: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES
      }),
    };
  }
}
