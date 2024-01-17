import { Injectable } from '@nestjs/common';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class OpenaiService {
  private readonly client: OpenAIClient;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    this.client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  }

  async getChatCompletions(deploymentId: string, messages: any[]) {
    return await this.client.getChatCompletions(deploymentId, messages);
  }
}
