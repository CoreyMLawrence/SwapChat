import * as dotenv from 'dotenv';
import { LLMModel, ChatMessage } from './types';
import { validateAndCleanResponse } from '../utils/responseFormatter';

dotenv.config();

export class GeminiFlashModel implements LLMModel {
  id = 'gemini-flash';
  name = 'Gemini 2.0 Flash';
  apiKeyEnvName = 'GEMINI_API_KEY';

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
        content:
          'You are a helpful assistant. Provide direct responses without any JSON formatting or metadata. Your responses should be in plain text or markdown format when appropriate.',
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
          model: 'google/gemini-2.0-flash-thinking-exp:free',
          messages: formattedMessages,
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
    return data;
  }
}
