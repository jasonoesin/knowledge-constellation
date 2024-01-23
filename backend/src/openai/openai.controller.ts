import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('openai')
export class OpenaiController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly neo4jService: Neo4jService,) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('prompt')
  async postPromptResults(@Body() payload: { keyword: string }, @Req() request: Request) {
    const username = request['user'].sub;
    const prompt = payload.keyword;

    const definition = await this.getMainDefinition(prompt);
    
    return definition;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post("prompt_confirm")
  async postPromptConfirm(@Body() payload: { definition: string }, @Req() request: Request){
    const username = request['user'].sub;
    const definition = payload.definition;

    const cypherQuery = await this.getImportCypherQuery(definition);

    await this.importData(cypherQuery.choices[0].message.content, username)

    return cypherQuery;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('prompt_update')
  async postPromptUpdateResults(@Body() payload: { definition: string }, @Req() request: Request) {
    const username = request['user'].sub;

    const definition = payload.definition;

    const cypherSchema = await this.neo4jService.getCypherScript(username);

    const convertedCypherSchema = await this.convertCypherSchema(cypherSchema);

    const cypherQuery = await this.getUpdateCypherQuery(definition, convertedCypherSchema.choices[0].message.content);

    await this.importData(cypherQuery.choices[0].message.content, username)

    return cypherQuery;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post("delete_graph")
  async deleteGraph(@Req() request: Request){
    const username = request['user'].sub;

    await this.neo4jService.deleteData(username);

    return {"message":"sucess"};
  }

  async importData(cypherQuery : string, username: string): Promise<void> {
    this.neo4jService.deleteData(username);

    await this.neo4jService.importData(cypherQuery,username);
  }

  async convertCypherSchema(input: string){
     const messages = [
      {role: 'system', content: "You are a helpful assistant. You will convert an exported cypher query Neo4J to a more readable cypher query."},
      {role: 'user', content: '\"CREATE CONSTRAINT UNIQUE_IMPORT_NAME FOR (node:`UNIQUE IMPORT LABEL`) REQUIRE (node.`UNIQUE IMPORT ID`) IS UNIQUE;\r\nUNWIND [{_id:2, properties:{name:\"Identifying and fixing bugs early in the development process\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:BugsEarly;\r\nUNWIND [{_id:46, properties:{name:\"Different scenarios and inputs\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:ScenariosAndInputs;\r\nUNWIND [{_id:5, properties:{name:\"Developers\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Role;\r\nUNWIND [{_id:24, properties:{name:\"Software development lifecycle\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Lifecycle;\r\nUNWIND [{_id:43, properties:{name:\"Individual units of code (functions, classes, or modules)\"}}, {_id:44, properties:{name:\"Ensuring functionality and meeting specified requirements\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:CodeUnits;\r\nUNWIND [{_id:3, properties:{name:\"Improving code maintainability\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:CodeMaintainability;\r\nUNWIND [{_id:42, properties:{name:\"Unit testing\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:TestingMethod;\r\nUNWIND [{_id:45, properties:{name:\"Writing test cases\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:TestCases;\r\nUNWIND [{_id:1, properties:{name:\"Validating the behavior of the unit being tested\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Behavior;\r\nUNWIND [{_id:0, properties:{name:\"Executing tests\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Tests;\r\nUNWIND [{_id:4, properties:{name:\"Confidence in the correctness of the software\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Correctness;\r\nUNWIND [{start: {_id:3}, end: {_id:4}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:PROVIDES_CONFIDENCE_IN]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:46}, end: {_id:0}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:EXECUTES]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:4}, end: {_id:5}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:PERFORMED_BY]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:0}, end: {_id:1}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:VALIDATES]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:43}, end: {_id:44}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:ENSURES_FUNCTIONALITY_AND_REQUIREMENTS_OF]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:1}, end: {_id:2}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:HELPS_IDENTIFY_AND_FIXES]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:5}, end: {_id:24}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:AS_PART_OF]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:44}, end: {_id:45}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:INVOLVES_WRITING]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:2}, end: {_id:3}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:IMPROVES]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:42}, end: {_id:43}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:TESTS_ISOLATED_UNITS_OF]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:45}, end: {_id:46}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:COVERS]->(end) SET r += row.properties;\r\nMATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;\r\nDROP CONSTRAINT UNIQUE_IMPORT_NAME;\r\n\"' },
      {role: 'assistant', content: `MERGE (:TestingMethod {name: "Unit testing"})
      -[:TESTS_ISOLATED_UNITS_OF]->(:CodeUnits {name: "Individual units of code (functions, classes, or modules)"})
      -[:ENSURES_FUNCTIONALITY_AND_REQUIREMENTS_OF]->(:CodeUnits {name: "Ensuring functionality and meeting specified requirements"})
      -[:INVOLVES_WRITING]->(:TestCases {name: "Writing test cases"})
      -[:COVERS]->(:ScenariosAndInputs {name: "Different scenarios and inputs"})
      -[:EXECUTES]->(:Tests {name: "Executing tests"})
      -[:VALIDATES]->(:Behavior {name: "Validating the behavior of the unit being tested"})
      -[:HELPS_IDENTIFY_AND_FIXES]->(:BugsEarly {name: "Identifying and fixing bugs early in the development process"})
      -[:IMPROVES]->(:CodeMaintainability {name: "Improving code maintainability"})
      -[:PROVIDES_CONFIDENCE_IN]->(:Correctness {name: "Confidence in the correctness of the software"})
      -[:PERFORMED_BY]->(:Role {name: "Developers"})
      -[:AS_PART_OF]->(:Lifecycle {name: "Software development lifecycle"})`},
        {role: 'user', content: '\"CREATE CONSTRAINT UNIQUE_IMPORT_NAME FOR (node:`UNIQUE IMPORT LABEL`) REQUIRE (node.`UNIQUE IMPORT ID`) IS UNIQUE;\r\nUNWIND [{_id:10, properties:{name:\"Computer\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Computer;\r\nUNWIND [{_id:11, properties:{name:\"Set of instructions to perform specific tasks\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:SetOfInstructions;\r\nUNWIND [{_id:9, properties:{name:\"Python, Java, C++, JavaScript\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:ProgrammingLanguages;\r\nUNWIND [{_id:14, properties:{name:\"Correct functionality of the program\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:CorrectFunctionality;\r\nUNWIND [{_id:7, properties:{name:\"Writing instructions or code\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:WritingInstructionsOrCode;\r\nUNWIND [{_id:15, properties:{name:\"Translating ideas and requirements\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Translation;\r\nUNWIND [{_id:16, properties:{name:\"Format that computers can understand and execute\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:ComputerUnderstandAndExecute;\r\nUNWIND [{_id:8, properties:{name:\"Software programs or applications\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:SoftwareProgramsAndApplications;\r\nUNWIND [{_id:6, properties:{name:\"Programming\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Process;\r\nUNWIND [{_id:13, properties:{name:\"Debugging and testing\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:DebuggingAndTesting;\r\nUNWIND [{_id:12, properties:{name:\"Code\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Code;\r\nUNWIND [{_id:32, properties:{name:\"Logic and structure of a program\"}}] AS row\r\nMERGE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:LogicAndStructure;\r\nUNWIND [{start: {_id:6}, end: {_id:7}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:INVOLVES]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:7}, end: {_id:8}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:CREATE]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:9}, end: {_id:10}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:COMMUNICATE_WITH]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:32}, end: {_id:12}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:INVOLVES_WRITING]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:15}, end: {_id:16}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:FORMAT]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:8}, end: {_id:9}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:USES]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:14}, end: {_id:15}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:TRANSLATE]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:11}, end: {_id:32}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:INVOLVES_DESIGNING]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:13}, end: {_id:14}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:ENSURE]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:10}, end: {_id:11}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:PROVIDE_WITH]->(end) SET r += row.properties;\r\nUNWIND [{start: {_id:12}, end: {_id:13}, properties:{}}] AS row\r\nMATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})\r\nMATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})\r\nMERGE (start)-[r:INVOLVES_DEBUGGING]->(end) SET r += row.properties;\r\nMATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;\r\nDROP CONSTRAINT UNIQUE_IMPORT_NAME;\r\n\"'},
        {role: 'assistant', content: `MERGE (:Process {name: "Programming"})
      -[:INVOLVES]->(:WritingInstructionsOrCode {name: "Writing instructions or code"})
      -[:CREATE]->(:SoftwareProgramsAndApplications {name: "Software programs or applications"})
      -[:USES]->(:ProgrammingLanguages {name: "Python, Java, C++, JavaScript"})
      -[:COMMUNICATE_WITH]->(:Computer {name: "Computer"})
      -[:PROVIDE_WITH]->(:SetOfInstructions {name: "Set of instructions to perform specific tasks"})
      -[:INVOLVES_DESIGNING]->(:LogicAndStructure {name: "Logic and structure of a program"})
      -[:INVOLVES_WRITING]->(:Code {name: "Code"})
      -[:INVOLVES_DEBUGGING]->(:DebuggingAndTesting {name: "Debugging and testing"})
      -[:ENSURE]->(:CorrectFunctionality {name: "Correct functionality of the program"})
      -[:TRANSLATE]->(:Translation {name: "Translating ideas and requirements"})
      -[:FORMAT]->(:ComputerUnderstandAndExecute {name: "Format that computers can understand and execute"})`},
      { role: 'user', content: input},
    ]

    return await this.openaiService.getChatCompletions(messages);
  }

  async getMainDefinition(input: string){
    const messages = [
      {role: 'system', content: "You are a helpful assistant. You will answer a variative definition and detail short and briefly from the input provided by the user."},
      {role: 'user', content: "test" },
      {role: 'assistant', content: "A test is an assessment or evaluation used to measure a person's knowledge, skills, or abilities in a particular subject or area. It is usually administered through a series of questions or tasks designed to determine the individual's level of understanding or proficiency. Tests are commonly used in educational settings to assess students' learning progress or in employment settings as part of the hiring process or to evaluate workers' competence." },
      {role: 'user', content: "test" },
      {role: 'assistant', content: "In software development, particularly in the context of test-driven development (TDD), a test refers to a set of conditions or criteria used to verify that a specific aspect of a software application functions as intended. Tests in this context are written by developers to validate that their code meets the specified requirements and behaves correctly. This process involves creating automated test cases that can be run regularly to ensure that changes to the codebase do not introduce defects." },
      {role: 'user', content: "algorithm" },
      {role: 'assistant', content: "An algorithm is a set of step-by-step instructions or a sequence of logical rules designed to solve a specific problem or accomplish a specific task. Algorithms serve as the foundation for computer programming and are used to develop software or solve complex problems in various fields like mathematics, computer science, and engineering. In computer programming, algorithms provide a systematic approach to solving problems by breaking them down into smaller, more manageable steps. They define the logic and flow of a program, specifying the order of operations and the conditions for execution." },
      {role: 'user', content: "python" },
      {role: 'assistant', content: "Python is a high-level, interpreted programming language that is known for its simplicity and readability. It was created by Guido van Rossum and first released in 1991. Python supports multiple programming paradigms, including procedural, object-oriented, and functional programming. It has gained popularity among developers due to its clear and concise syntax, extensive standard library, and versatility. Python is widely used for various applications, including web development, data analysis, scientific computing, artificial intelligence, and automation."},
      
      {role: 'user', content: input }
    ]

    return await this.openaiService.getChatCompletions(messages);
  }

  async getImportCypherQuery(definition: string){
    const messages = [
      { role: 'system', content: 'You will answer in a structured format. Based on the information provided by user, you will convert the information from text to knowledge graph where it will be imported to Neo4J Graph Database using Cypher Query Language.'},

      { role: 'user', content: `The Central Processing Unit (CPU) is the core component of a computer that carries out instructions and performs calculations. It is often referred to as the brain of the computer as it is responsible for executing tasks and coordinating the operations of other hardware components.` },
      { role: "assistant", content: `MERGE (:Component {name: "Central Processing Unit", function: "Carrying out instructions and performing calculations", nickname: "CPU"})-[:IS_CORE_COMPONENT_OF]->(:Computer {name: "Computer"})<-[:COORDINATES_OPERATIONS_OF]-(:HardwareComponents {name: "Other hardware components"})-[:KNOWN_AS]->(:Nickname {name: "Brain of the computer"})` },

      { role: 'user', content: `A laptop is a portable computer that is designed to be used on a person's lap or on a flat surface. It is smaller and more lightweight than a desktop computer, making it convenient for use while traveling or on-the-go. Laptops typically have a built-in screen, keyboard, and trackpad or mouse for user input. They are capable of performing tasks and running software similar to a desktop computer.` },
      { role: "assistant", content: `MERGE (:Computer {name: "Laptop", type: "Portable"})-[:IS_USED_ON]->(:Location {name: "Person's lap or flat surface"})-[:IS_SMALLER_AND_MORE_LIGHTWEIGHT_THAN]->(:Computer {name: "Desktop computer"})-[:CONVENIENT_FOR_USE_WHILE]->(:Activity {name: "Traveling or on-the-go"})-[:HAS]->(:BuiltInComponents {name: "Screen"})-[:HAS]->(:BuiltInComponents {name: "Keyboard"})-[:HAS]->(:BuiltInComponents {name: "Trackpad or mouse for user input"})-[:CAPABLE_OF]->(:Functionality {name: "Performing tasks and running software similar to a desktop computer"})` },

      { role: 'user', content: `Unit testing is a software testing technique where individual components or units of a program are tested in isolation to verify their functionality. In unit testing, the focus is on testing the smallest units of code, such as functions or methods, to ensure that they work correctly. The goal of unit testing is to examine each unit of code in isolation and verify that it produces the expected output for a given set of inputs. This is typically achieved by creating test cases that cover various scenarios and edge cases. Unit tests are automated, which means they can be run repeatedly and easily as part of a continuous integration process. Unit testing helps identify bugs or issues early in the development cycle, enabling developers to fix them before they propagate to higher levels of testing. It also provides a form of documentation and serves as a safety net when refactoring or making changes to code, as it allows developers to quickly verify that the existing functionality has not been broken.` },
      { role: "assistant", content: `MERGE (:TestingTechnique {name: "Unit testing"})-[:VERIFIES_FUNCTIONALITY_OF]->(:ProgramComponents {name: "Individual components or units of a program"})-[:VERIFIES]->(:Functionality {name: "Functionality of the units of code"})
      -[:FOCUSES_ON]->(:CodeUnits {name: "Smallest units of code (functions or methods)"})-[:ENSURES_PRODUCTION_OF]->(:ExpectedOutput {name: "Expected output for a given set of inputs"})-[:ACHIEVED_BY]->(:CreationOf {name: "Creating test cases"})-[:COVERS]->(:ScenariosAndEdgeCases {name: "Various scenarios and edge cases"})-[:AUTOMATED]->(:Execution {name: "Repeating and easy execution as part of a continuous integration process"})-[:HELPS_IDENTIFY]->(:BugsOrIssues {name: "Bugs or issues early in the development cycle"})
      -[:ENABLES_DEVELOPERS_TO]->(:Fixing {name: "Fixing bugs before they propagate to higher levels of testing"})-[:PROVIDES]->(:Documentation {name: "Form of documentation"})-[:SERVES_AS]->(:SafetyNet {name: "Safety net when refactoring or making changes to code"})-[:ALLOWS_DEVELOPERS_TO]->(:Verification {name: "Quickly verify existing functionality"})` },

      { role: 'user', content: definition},
    ];

    return await this.openaiService.getChatCompletions(messages);
  }

  async getUpdateCypherQuery(definition: string, schema? : string){
    const example = `MERGE (:PlatformOrFramework {name: "Specific platform or framework"})-[:COMMONLY_USED_IN]->(:MobileAppDevelopment {name: "Mobile app development"})-[:INCLUDING]->(:Debuggers {name: "Debuggers"})-[:INCLUDING]->(:DocumentationAndResources {name: "Documentation and resources"})-[:COMMONLY_USED_IN]->(:OwnCode {name: "Integration into their own code"})-[:INCLUDING]->(:Compilers {name: "Compilers"})-[:INCLUDES]->(:Abbreviation {name: "SDK", expansion: "Software Development Kit"})-[:PROVIDED_BY]->(:SoftwareDevelopers {name: "Software developers or companies"})-[:COMMONLY_USED_IN]->(:APIs {name: "Application Programming Interfaces"})-[:FACILITATES_CREATION_OF]->(:SoftwareApplications {name: "Software applications"})-[:EASIER_FOR_DEVELOPERS]->(:PreBuiltFunctionality {name: "Easier for developers to build applications"})-[:COMMONLY_USED_IN]->(:IntegrationWithPlatforms {name: "Integration with various software platforms"})-[:INCLUDING]->(:Tools {name: "Set of tools"})-[:INCLUDING]->(:CodeLibraries {name: "Code libraries"})-[:COMMONLY_USED_IN]->(:GameDevelopment {name: "Game development"})`

    const messages = [
      { role: 'system', content: 'You will answer in a structured format. Update the cypher query schema by adding the knowledge and informations from the text. Use only one MERGE syntax.'},

      { role: 'user', content: (`SDK stands for Software Development Kit. It is a collection of tools, libraries, documentation, and resources that developers use to build software applications for a specific platform or framework. An SDK provides pre-written code, APIs (Application Programming Interfaces), sample projects, and other resources that make it easier for developers to create applications for a particular software platform. SDKs are commonly used for mobile app development, where they provide libraries and tools specific to operating systems like iOS or Android. They can also be used for other platforms such as game development, cloud computing, or IoT (Internet of Things) devices. SDKs generally include compilers, debuggers, emulators, and other utilities that help developers in coding, testing, and deploying their applications efficiently.` + "\n\n" +example)},
      { role: "assistant", content: `MERGE (:PlatformOrFramework {name: "Specific platform or framework"})-[:COMMONLY_USED_IN]->(:MobileAppDevelopment {name: "Mobile app development"})-[:INCLUDING]->(:Debuggers {name: "Debuggers"})-[:INCLUDING]->(:DocumentationAndResources {name: "Documentation and resources"})-[:COMMONLY_USED_IN]->(:OwnCode {name: "Integration into their own code"})-[:INCLUDING]->(:Compilers {name: "Compilers"})-[:INCLUDES]->(:Abbreviation {name: "SDK", expansion: "Software Development Kit"})-[:PROVIDED_BY]->(:SoftwareDevelopers {name: "Software developers or companies"})-[:COMMONLY_USED_IN]->(:APIs {name: "Application Programming Interfaces"})-[:FACILITATES_CREATION_OF]->(:SoftwareApplications {name: "Software applications"})-[:EASIER_FOR_DEVELOPERS]->(:PreBuiltFunctionality {name: "Easier for developers to build applications"})-[:COMMONLY_USED_IN]->(:IntegrationWithPlatforms {name: "Integration with various software platforms"})-[:INCLUDING]->(:Tools {name: "Set of tools"})-[:INCLUDING]->(:CodeLibraries {name: "Code libraries"})-[:COMMONLY_USED_IN]->(:GameDevelopment {name: "Game development"})-[:COMMONLY_USED_IN]->(:CloudComputing {name: "Cloud computing"})-[:COMMONLY_USED_IN]->(:IoTDevices {name: "Internet of Things devices"})`},

      { role: 'user', content: (definition + "\n\n" + schema)},
    ];

    return await this.openaiService.getChatCompletions(messages);
  }
}