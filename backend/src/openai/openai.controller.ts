import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  // Testing
  @Get('chat')
  async getChatCompletions() {
    const deploymentId = process.env.MODEL_DEPLOYMENT_NAME;
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the meaning of Digital Services ?' },
    ];

    return await this.openaiService.getChatCompletions(deploymentId, messages);
  }
}