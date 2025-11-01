import type { DrashaLength, RabbinicStyle, TorahPortion } from '../types.ts';

interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export const generateDrasha = async (
  torahPortion: TorahPortion,
  length: DrashaLength,
  style: RabbinicStyle | string,
  callbacks: StreamCallbacks
): Promise<void> => {
  const { onChunk, onComplete, onError } = callbacks;
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ torahPortion, length, style }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('The response from the server is empty.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        
        // Keep the last partial line in the buffer
        buffer = lines.pop() || ''; 

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.substring(6);
            try {
              const parsed = JSON.parse(jsonString);
              if (parsed.text) {
                onChunk(parsed.text);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error('Failed to parse stream chunk:', jsonString, e);
            }
          }
        }
      }
    };
    
    processStream().catch(err => {
        console.error("Error processing stream:", err);
        onError(err instanceof Error ? err : new Error('An error occurred while reading the response.'));
    });

  } catch (error) {
    console.error("Error communicating with serverless function:", error);
    onError(error instanceof Error ? error : new Error('An unknown error occurred.'));
  }
};
