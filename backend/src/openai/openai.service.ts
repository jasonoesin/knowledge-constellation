import { Injectable } from '@nestjs/common';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class OpenaiService {
  private readonly client: OpenAIClient;
  private readonly deploymentId: string;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    this.deploymentId = process.env.MODEL_DEPLOYMENT_NAME;
    this.client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  }

  async getChatCompletions( messages: any[]) {
    return await this.client.getChatCompletions(this.deploymentId, messages);
  }
}
