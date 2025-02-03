import * as dotenv from 'dotenv';
import { LLMModel, ChatMessage } from './types';
import { validateAndCleanResponse } from '../utils/responseFormatter';

dotenv.config();

export class R1Model implements LLMModel {
  id = 'r1';
  name = 'DeepSeek R1';
  supportsImages = false; // Add this line
  apiKeyEnvName = 'OPENROUTER_API_KEY'; // Add this line

  private readonly SYSTEM_PROMPT = `You are a helpful AI assistant. Follow these rules for all responses:
1. Provide direct, clear answers
2. Use markdown formatting when appropriate
3. Never include JSON, metadata, or timestamps in your response
4. Never mention that you're an AI unless specifically asked
5. Never use emojis unless specifically requested
6. Keep responses concise and focused`;

  async getResponse(message: string): Promise<any> {
    const apiKey = process.env[this.apiKeyEnvName];
    if (!apiKey) {
      throw new Error(
        `API key ${this.apiKeyEnvName} is not defined in environment variables`
      );
    }

    // Parse the incoming message context
    const messages = JSON.parse(message) as ChatMessage[];

    // Add system message at the beginning
    const formattedMessages = [
      {
        role: 'system',
        content: this.SYSTEM_PROMPT,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Local Development',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error?.metadata?.raw?.error?.message ||
        errorData?.error?.message ||
        response.statusText;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Clean the response before returning
    return {
      choices: [
        {
          message: {
            content: validateAndCleanResponse(data),
          },
        },
      ],
    };
  }
}
