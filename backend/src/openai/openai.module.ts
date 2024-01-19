import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Module({
  providers: [OpenaiService, Neo4jService],
  exports: [OpenaiService],
  controllers: [OpenaiController],
})
export class OpenaiModule {}
