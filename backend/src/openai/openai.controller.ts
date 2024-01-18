import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  // Testing
  @Get('chat')
  async getChatCompletions() {
    const messages = [
      { role: 'system', content: 'You will answer very briefly in a structured format. Based on the information provided by user, identify the main topical clusters. Then, list the top keywords associated with each cluster. The serialization for each cluster will be as follows : Cluster Definition#Top Keywords\nCluster Definition2#Top Keywords 2\n etc...' },
      { role: 'user', content: 'InfraNodus is a text analysis tool that uses network visualization to help users identify key topics and connections within their data. It analyzes text data, such as articles, documents, or social media posts, and creates a visual representation of the interconnected topics and keywords within the text.\n\nInfraNodus uses algorithms to analyze the text data and extract key concepts and their relationships. It then creates a network graph that shows the connections between different topics and keywords, allowing users to gain insights and understand the underlying structure of the text.\n\nInfraNodus can be used for various purposes, such as content analysis, trend detection, information retrieval, or knowledge discovery. It is particularly useful for researchers, journalists, marketers, and anyone who needs to analyze and understand large amounts of text data.\n\nOverall, InfraNodus is a tool that helps users visualize and navigate through the complex web of information within their textual data, enabling them to gain valuable insights and make more informed decisions.' },
      { role: "assistant", content: "InfraNodus - Text Analysis Tool#InfraNodus, text analysis tool, network visualization\nFunctionality and Algorithms#algorithms, analyze text data, extract key concepts, relationships, network graph\nApplications of InfraNodus#content analysis, trend detection, information retrieval, knowledge discovery" },
      { role: 'user', content: 'A fresh graduate is a person who has recently completed their studies and has earned a university degree. They are typically new to the workforce and have little or no work experience in their field of study.' },
    ];

    return await this.openaiService.getChatCompletions(messages);
  }
}