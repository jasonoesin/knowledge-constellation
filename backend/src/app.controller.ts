import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly neo4jService: Neo4jService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('query')
  async yourQueryHandler(): Promise<any[]> {
    const cypherQuery = 'MATCH (n) RETURN n LIMIT 10';
    return this.neo4jService.runQuery(cypherQuery);
  }
}
