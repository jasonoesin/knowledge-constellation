import { Injectable } from '@nestjs/common';
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

    if (user && user.password === password) {
      return user;
    }
    return null;
  }
  
  async registerUser(username: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.registerUser(username, hashedPassword);

    const payload = { sub: user.username};

    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
    };
  }
}
