import { Injectable } from '@nestjs/common';
import { promises } from 'dns';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  private readonly driver: Driver;

  constructor() {
    const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

    this.driver = neo4j.driver(
        NEO4J_URI,
        neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
  }

  async runQuery(query: string, params?: Record<string, any>): Promise<any[]> {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(query, params);
      return result.records.map(record => record.toObject());
    } finally {
      await session.close();
    }
  }

  async close() {
    await this.driver.close();
  }

  async importData(cypherQuery: string): Promise<void> {
    // try {
    //   await this.runQuery(cypherQuery);
    // } catch (error) {
    //   console.error('Error importing data:', error);
    //   throw error;
    // }
    const username = "boba";

    const replaced = cypherQuery.replace("MERGE","\nMERGE (graph)-[:CONTAINS]->")

    const updatedQuery = `
    MATCH (user:User {username: $username})-[:OWNS]->(graph:Graph {name: $graphName})`.concat(replaced)

    try {
    await this.runQuery(updatedQuery, 
    { 
      username: username,
      graphName: `Graph_${username}`
    }
    );
    } catch (error) {
    console.error('Error importing data:', error);
    throw error;
    }
  }

  async deleteData(): Promise<void> {
    const username = "boba";

    try {
      await this.runQuery(`
        MATCH (user:User {username: $username})-[:OWNS]->(graph:Graph)-[*]->(n)-[r]-(m)
        DETACH DELETE n, r, m
      `, { username: username });
      } catch (error) {
        console.error('Error importing data:', error);
        throw error;
      }
  }

  async getSchema(): Promise<any[]> {
    const username = "boba"

    const cypherQuery = `MATCH (user:User {username: $username})-[:OWNS]->(graph:Graph)-[*]->(n)-[r]-(m) RETURN n, r, m`;
    return this.runQuery(cypherQuery, { username: username });
  }

  async getCypherScript(): Promise<string> {
    const session: Session = this.driver.session();

    try {
      const result = await session.run(
        `CALL apoc.export.cypher.all(null, {
            streamStatements: true,
            format: "plain",
            cypherFormat: "updateAll"
        });`
      );

      return result.records[0].get('cypherStatements');
    } finally {
      await session.close();
    }
  }
}
