// auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES },
      }),
  ],
  providers: [AuthService, Neo4jService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
