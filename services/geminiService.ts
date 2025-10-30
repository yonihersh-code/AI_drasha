import type { DrashaLength, RabbinicStyle, TorahPortion } from '../types';

export const generateDrasha = async (
  torahPortion: TorahPortion,
  length: DrashaLength,
  style: RabbinicStyle | string
): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ torahPortion, length, style }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An unknown error occurred on the server.');
    }

    return data.drasha;
  } catch (error) {
    console.error("Error communicating with serverless function:", error);
    // Re-throw a user-friendly error
    if (error instanceof Error) {
        throw new Error(`Failed to generate drasha: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while trying to generate the drasha.");
  }
};
