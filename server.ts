import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { getLLMResponse, getAvailableModels } from './src/llmInteraction';
import {
  validateAndCleanResponse,
  cleanErrorResponse,
} from './src/utils/responseFormatter';

dotenv.config();

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
app.get('/api/models', (req: Request, res: Response) => {
  try {
    console.log('GET /api/models called');
    const models = getAvailableModels();
    console.log('Available models:', models);

    const modelData = models.map((m) => ({
      id: m.id,
      name: m.name,
    }));

    res.json(modelData);
  } catch (error: unknown) {
    console.error('Error in /api/models:', error);
    if (error instanceof Error) {
      res.status(500).json({
        error: 'Failed to load models',
        details: String(error),
      });
    } else {
      res.status(500).json({
        error: 'Failed to load models',
        details: String(error),
      });
    }
  }
});

app.post('/api/llm', async (req: Request, res: Response) => {
  const { modelId, userMessage } = req.body;
  try {
    const response = await getLLMResponse(modelId, userMessage);
    const cleanedResponse = validateAndCleanResponse(response);
    const finalResponse = cleanErrorResponse(cleanedResponse);
    res.send(finalResponse);
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      try {
        // Try to parse JSON error message
        const parsedError = JSON.parse(error.message);
        errorMessage =
          parsedError?.error?.metadata?.raw?.error?.message ||
          parsedError?.error?.message ||
          error.message;
      } catch {
        errorMessage = error.message;
      }
    }

    // Clean up the error message
    errorMessage = errorMessage.replace(/^Error:\s*/, '');
    res.status(500).send(errorMessage);
  }
});

// Serve static files - make sure this comes after API routes
app.use(express.static('.'));

// Error handling middleware
app.use((err: unknown, req: Request, res: Response, next: Function) => {
  console.error('Error:', err);
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('API endpoints:');
  console.log('- GET  /api/models');
  console.log('- POST /api/llm');
});
