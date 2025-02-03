export interface MessageContent {
  type: 'text';
  text?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  apiKeyEnvName: string;
  getResponse(message: string): Promise<any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatContext {
  messages: ChatMessage[];
}

export interface LLMResponse {
  role: 'assistant';
  content: string;
}
