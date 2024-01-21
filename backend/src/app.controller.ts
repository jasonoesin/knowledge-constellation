import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly neo4jService: Neo4jService) {}

  @Get('graph')
  async getGraph(): Promise<any[]> {
    return this.neo4jService.getSchema();
  }
}
