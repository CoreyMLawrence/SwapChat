function extractDeepErrorMessage(obj: any): string {
  if (!obj) return 'Unknown error';

  // Check for nested error structures
  if (obj.error?.metadata?.raw) {
    try {
      const rawError = JSON.parse(obj.error.metadata.raw);
      return rawError.error?.message || obj.error.message;
    } catch {
      // If parsing fails, fall back to error message
      return obj.error.message;
    }
  }

  // Check common error paths
  return (
    obj.error?.message ||
    obj.message ||
    (typeof obj === 'string' ? obj : 'Unknown error')
  );
}

export function cleanLLMResponse(response: string): string {
  try {
    // Check if the response is JSON
    if (response.trim().startsWith('[') || response.trim().startsWith('{')) {
      const parsed = JSON.parse(response);

      // If it's an error response, extract just the message
      if (parsed.error) {
        return extractDeepErrorMessage(parsed);
      }

      // Handle array response
      if (Array.isArray(parsed)) {
        return parsed[0]?.content || parsed[0]?.message?.content || parsed[0];
      }

      // Handle single object response
      return parsed.content || parsed.message?.content || parsed;
    }

    return response;
  } catch (error) {
    // If JSON parsing fails, return original response
    return response;
  }
}

export function extractErrorMessage(error: any): string {
  try {
    if (typeof error === 'string') {
      const parsed = JSON.parse(error);
      return (
        parsed?.error?.message ||
        parsed?.error?.metadata?.raw?.error?.message ||
        parsed?.message ||
        error
      );
    }
    return error?.message || 'An unknown error occurred';
  } catch {
    return error?.message || String(error);
  }
}

export function validateAndCleanResponse(response: any): string {
  if (!response) return 'No response received';

  // Handle error responses
  if (response.error) {
    return extractDeepErrorMessage(response);
  }

  // If response is already a string, clean it
  if (typeof response === 'string') {
    return cleanLLMResponse(response);
  }

  // Handle API response structure
  if (response.choices?.[0]?.message?.content) {
    return response.choices[0].message.content;
  }

  // Try to extract content from various possible formats
  const content =
    response.content ||
    response.message?.content ||
    response.text ||
    JSON.stringify(response);

  return cleanLLMResponse(content);
}

export function cleanErrorResponse(response: any): string {
  try {
    const parsed =
      typeof response === 'string' ? JSON.parse(response) : response;
    if (parsed.error) {
      return extractDeepErrorMessage(parsed);
    }
    return response;
  } catch {
    return response;
  }
}
