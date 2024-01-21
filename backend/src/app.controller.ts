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

  // @Get('import')
  // async importData(): Promise<void> {
  //   // Clean Data First Before Importing
  //   this.neo4jService.deleteData();

  //   const cypherQuery = `
  //   MERGE (:ElectronicCircuit {name: \"GPU\", function: \"Rapidly manipulate and alter memory\"})\n      -[:ACCELERATES]->(:DataProcessing {data: [\"Images\", \"Videos\", \"Visual data\"]})\n      -[:USED_IN]->(:Applications {applications: [\"Gaming\", \"Visual effects\", \"Scientific simulations\"]})\n      -[:HAS_CAPABILITIES]->(:ParallelProcessing {type: \"Multiple calculations simultaneously\"})\n      -[:DELIVERS]->(:Performance {performance: \"High performance for graphical tasks\"})
  //   `;
  //   await this.neo4jService.importData(cypherQuery);
  // }
}
