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
    try {
      await this.runQuery(cypherQuery);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  async deleteData(): Promise<void> {
    try {
        await this.runQuery(`
        MATCH (n)
        DETACH DELETE n
        `);
      } catch (error) {
        console.error('Error importing data:', error);
        throw error;
      }
  }

  async getSchema(): Promise<any[]> {
    const cypherQuery = `MATCH (n)-[r]-(m) RETURN n, r, m`;
    return this.runQuery(cypherQuery);
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
