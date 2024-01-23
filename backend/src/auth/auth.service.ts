// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly neo4jService: Neo4jService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && user.password === password) {
      return user;
    }
    return null;
  }
  
  async registerUser(username: string, password: string): Promise<any> {
    const user = await this.userService.registerUser(username, password);

    return user;
  }
}
