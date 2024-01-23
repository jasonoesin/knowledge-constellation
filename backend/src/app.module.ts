import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './openai/openai.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    OpenaiModule, Neo4jModule],
  controllers: [AppController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
