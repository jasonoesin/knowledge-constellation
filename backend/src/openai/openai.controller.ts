import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Controller('openai')
export class OpenaiController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly neo4jService: Neo4jService,) {}

  // Testing
  @Get('prompt')
  async getPromptResults() {
    const responses = [];

    const prompt = "motherboard";

    const definition = await this.getMainDefinition(prompt);
    responses.push(definition);

    const cypherQuery = await this.getImportCypherQuery(definition.choices[0].message.content);
    responses.push(cypherQuery);

    this.importData(cypherQuery.choices[0].message.content)

    return responses;
  }

  async importData(cypherQuery : string): Promise<void> {
    // Clean Data First Before Importing
    this.neo4jService.deleteData();

    await this.neo4jService.importData(cypherQuery);
  }

  @Get('prompt_update')
  async getPromptUpdateResults() {
    const responses = [];

    const prompt = "motherboard";

    const definition = await this.getMainDefinition(prompt);
    responses.push(definition);

    const cypherSchema = await this.neo4jService.getCypherScript();

    const cypherQuery = await this.getUpdateCypherQuery(definition.choices[0].message.content, cypherSchema);
    responses.push(cypherQuery);

    this.importData(cypherQuery.choices[0].message.content)

    return responses;
  }

  @Get('cypher')
  async getCypherScript(){
    return this.neo4jService.getCypherScript();
  }

  async getMainDefinition(input: string){
    const messages = [
      {role: 'system', content: "You are a helpful assistant. You will answer the definition from inputs provided by user short and brief."},
      { role: 'user', content: input }
    ]

    return await this.openaiService.getChatCompletions(messages);
  }

  async getImportCypherQuery(definition: string){
    const messages = [
      { role: 'system', content: 'You will answer in a structured format. Based on the information provided by user, you will convert the information from text to knowledge graph where it will be imported to Neo4J Graph Database using Cypher Query Language.'},

      { role: 'user', content: `The Central Processing Unit (CPU) is the core component of a computer that carries out instructions and performs calculations. It is often referred to as the brain of the computer as it is responsible for executing tasks and coordinating the operations of other hardware components.` },
      { role: "assistant", content: `MERGE (:Component {name: "Central Processing Unit", function: "Carrying out instructions and performing calculations", nickname: "CPU"})
      -[:IS_CORE_COMPONENT_OF]->(:Computer {name: "Computer"})
      <-[:COORDINATES_OPERATIONS_OF]-(:HardwareComponents {name: "Other hardware components"})
      -[:KNOWN_AS]->(:Nickname {name: "Brain of the computer"})
      ` },

      { role: 'user', content: `A laptop is a portable computer that is designed to be used on a person's lap or on a flat surface. It is smaller and more lightweight than a desktop computer, making it convenient for use while traveling or on-the-go. Laptops typically have a built-in screen, keyboard, and trackpad or mouse for user input. They are capable of performing tasks and running software similar to a desktop computer.` },
      { role: "assistant", content: `MERGE (:Computer {name: "Laptop", type: "Portable"})
      -[:IS_USED_ON]->(:Location {name: "Person's lap or flat surface"})
      -[:IS_SMALLER_AND_MORE_LIGHTWEIGHT_THAN]->(:Computer {name: "Desktop computer"})
      -[:CONVENIENT_FOR_USE_WHILE]->(:Activity {name: "Traveling or on-the-go"})
      -[:HAS]->(:BuiltInComponents {name: "Screen"})
      -[:HAS]->(:BuiltInComponents {name: "Keyboard"})
      -[:HAS]->(:BuiltInComponents {name: "Trackpad or mouse for user input"})
      -[:CAPABLE_OF]->(:Functionality {name: "Performing tasks and running software similar to a desktop computer"})` },


      { role: 'user', content: definition},
    ];

    return await this.openaiService.getChatCompletions(messages);
  }

  async getUpdateCypherQuery(definition: string, schema? : string){
    const example = 'CREATE CONSTRAINT UNIQUE_IMPORT_NAME FOR (node:`UNIQUE IMPORT LABEL`) REQUIRE (node.`UNIQUE IMPORT ID`) IS UNIQUE; UNWIND [{_id:10, properties:{number:4, composition:"Muscle", name:"Main Sections"}}] AS row MERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:HeartSection; UNWIND [{_id:11, properties:{type:"Electrical"}}] AS row MERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Impulses; UNWIND [{_id:12, properties:{organs:["Brain", "Nervous System"]}}] AS row MERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:NervousSystem; UNWIND [{_id:6, properties:{system:"Circulatory", size:"Fist-sized", function:"Pumps blood", name:"Heart"}}] AS row MERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Organ; UNWIND [{start: {_id:10}, end: {_id:11}, properties:{}}] AS row MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id}) MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id}) MERGE (start)-[r:POWERED_BY]->(end) SET r += row.properties; UNWIND [{start: {_id:6}, end: {_id:10}, properties:{}}] AS row MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id}) MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id}) MERGE (start)-[r:HAS_SECTION]->(end) SET r += row.properties; UNWIND [{start: {_id:11}, end: {_id:12}, properties:{}}] AS row MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id}) MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id}) MERGE (start)-[r:DIRECTED_BY]->(end) SET r += row.properties; MATCH (n:`UNIQUE IMPORT LABEL`) WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`; DROP CONSTRAINT UNIQUE_IMPORT_NAME;'

    const messages = [
      { role: 'system', content: 'You will answer in a structured format. Based on the information provided by user, you will firstly convert the provided text to knowledge graph where it will be imported to Neo4J Graph Database using Cypher Query Language. Then, update the provided Cypher Query with the new informations while retaining the old informations .'},

      { role: 'user', content: (`The heart is a vital organ in the human body responsible for pumping blood and maintaining the circulatory system. About the size of a clenched fist, the heart is composed of four chambers, each consisting of muscular tissue that contracts and relaxes to facilitate the circulation of blood. Its rhythmic beating is regulated by electrical impulses generated internally.
      
      ` + example)},
      { role: "assistant", content: `MERGE (:Organ {name: "Heart", size: "Clenched fist", function: "Pumping blood", system: "Circulatory"})
      -[:HAS_SECTION]->(:HeartSection {name: "Main Sections", number: 4, composition: "Muscular tissue"})
      -[:POWERED_BY]->(:Impulses {type: "Electrical"})
      -[:REGULATED_BY]->(:RhythmicBeating {mechanism: "Internal electrical impulses"})
      -[:DIRECTED_BY]->(:NervousSystem {organs: ["Brain", "Nervous System"]})`},

      { role: 'user', content: (definition + "\n\n" + schema)},
    ];

    return await this.openaiService.getChatCompletions(messages);
  }
}