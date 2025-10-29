import { GoogleGenAI } from "@google/genai";
import type { DrashaLength, RabbinicStyle, TorahPortion } from '../types';

export const generateDrasha = async (
  torahPortion: TorahPortion,
  length: DrashaLength,
  style: RabbinicStyle | string
): Promise<string> => {

  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured. Please add it to your deployment environment variables.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate a drasha for a synagogue service.

    **Torah Portion / Chag:** ${torahPortion}
    **Desired Length:** ${length}
    **In the style of:** ${style}

    The drasha should be inspiring, insightful, and appropriate for a diverse congregation.
    It should connect the themes of the Torah portion/chag to contemporary life.
    Please structure it with an introduction, a body with a few key points, and a concluding message.
    
    IMPORTANT: When quoting from Tanakh, Talmud, or other Jewish sources, you MUST provide the original Hebrew text, followed by an English translation and the source reference in parentheses.
    For example: a quote should be formatted like this: "כִּ֤י מִצִּיּוֹן֙ תֵּצֵ֣א תוֹרָ֔ה וּדְבַר־יְהוָ֖ה מִירוּשָׁלִָֽם׃" - "For out of Zion shall go forth the law, and the word of the LORD from Jerusalem." (Isaiah 2:3).

    Do not include a title for the drasha.
    Format the output in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating drasha:", error);
    throw new Error("Failed to communicate with the AI model. The API key may be invalid or the service may be unavailable.");
  }
};
