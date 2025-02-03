import * as dotenv from 'dotenv';
import { LLMModel } from './models/types';
import { R1Model } from './models/R1Model';
import { GeminiFlashModel } from './models/GeminiFlashModel';

dotenv.config();

// Initialize models with error handling
function initializeModels() {
  try {
    const models: { [key: string]: LLMModel } = {
      r1: new R1Model(),
      'gemini-flash': new GeminiFlashModel(),
    };
    console.log('Initialized models:', Object.keys(models));
    return models;
  } catch (error) {
    console.error('Error initializing models:', error);
    return {};
  }
}

const models = initializeModels();

export async function getLLMResponse(
  modelId: string,
  message: string
): Promise<any> {
  const model = models[modelId];
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }
  return model.getResponse(message);
}

export function getAvailableModels(): LLMModel[] {
  const modelList = Object.values(models);
  console.log('Available models:', modelList);
  return modelList;
}
