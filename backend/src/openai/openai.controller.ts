import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  // Testing
  @Get('prompt')
  async getPromptResults() {
    const responses = [];

    const prompt = "central processing unit";

    const definition = await this.getMainDefinition(prompt);
    responses.push(definition);

    const clusters = await this.getMainTopicalClusters(definition.choices[0].message.content);
    responses.push(clusters);

    return responses;
  }

  async getMainDefinition(input: string){
    const messages = [
      {role: 'system', content: "You are a helpful assistant. You will answer the definition from inputs provided by user short and brief."},
      {role: 'user', content: 'heart rate variability' },
      {role: 'assistant', content: 'Heart rate variability (HRV) is a measure of the variation in time between each heartbeat, often used as an indicator of physiological resillence and emotional stress' },
      {role: 'user', content: 'heart disease' },
      {role: 'assistant', content: 'Heart disease, also known as cardiovascular disease, refers to a class of conditions that affect and impact the heart and blood vessels.' },
      {role: 'user', content: 'fresh graduate' },
      {role: 'assistant', content: 'A fresh graduate is a person who has recently completed their studies and has earned a university degree. They are typically new to the workforce and have little or no work experience in their field of study.' },
      { role: 'user', content: input }
    ]

    return await this.openaiService.getChatCompletions(messages);
  }

  async getMainTopicalClusters(input: string){
    const messages = [
      { role: 'system', content: 'You will answer in a structured format. Based on the information provided by user, identify the main topical clusters. Then, list the top keywords associated with each cluster. Make sure every top keywords listed is one word long and must be unique to each topic. '},
      { role: 'user', content: 'Heart rate variability (HRV) is a measure of the variation in time between each heartbeat, often used as an indicator of physiological resillence and emotional stress' },
      { role: "assistant", content: "Heart Rate Variability (HRV)#HRV, measure, variation, time, heartbeat\nPhysiological Resilience#resilience, indicator, physiological\nHealth and Wellness#health, wellness" },
      { role: 'user', content: 'Heart disease, also known as cardiovascular disease, refers to a class of conditions that affect and impact the heart and blood vessels.' },
      { role: "assistant", content: "Heart Disease#heart, disease, cardiovascular\nImpact on the Heart#impact, affect\nHealth-related Implications#health, implications" },
      { role: 'user', content: 'A fresh graduate is a person who has recently completed their studies and has earned a university degree. They are typically new to the workforce and have little or no work experience in their field of study.' },
      { role: "assistant", content: "Fresh Graduate#fresh, graduate, new, workforce\nUniversity Degree#university, degree\nWork Experience#work, experience\nCareer Start#career, start, studies"},
      { role: 'user', content: input },
    ];

    return await this.openaiService.getChatCompletions(messages);
  }
}