// user.service.ts
import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findByUsername(username: string): Promise<User> {
    const query = 'MATCH (u:User {username: $username}) RETURN u';
    const result = await this.neo4jService.runQuery(query, {username: username});

    if (result.length == 0) {
      return null;
    }

    console.log(result)

    const neo4jUser = result[0].u.properties;

    return { username: neo4jUser.username, password: neo4jUser.password };
  }

  async registerUser(username: string, password: string): Promise<User>{
    const query = 'CREATE (u:User { username: $username, password: $password }) RETURN u';
    const result = await this.neo4jService.runQuery(query, { username: username, password: password });

    const neo4jUser = result[0].u.properties;

    const createGraphQuery = `
      MATCH (u:User {username: $username})
      CREATE (u)-[:OWNS]->(g:Graph {name: $graphName})
      RETURN g
    `;

    const graphResult = await this.neo4jService.runQuery(createGraphQuery, {
      username: username,
      graphName: `Graph_${username}`,
    });

    return { username: neo4jUser.username, password: neo4jUser.password };
  }
}
