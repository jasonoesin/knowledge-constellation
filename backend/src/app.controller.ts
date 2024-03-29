import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly neo4jService: Neo4jService) {}

  @UseGuards(AuthGuard)
  @Get('graph')
  async getGraph(@Req() request: Request): Promise<any[]> {
    const username = request['user'].sub;
    return this.neo4jService.getSchema(username);
  }
}
