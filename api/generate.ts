// Using URL import as a fallback for environments without package.json
// @ts-ignore - Assuming the runtime supports URL imports
import { GoogleGenAI } from "https://aistudiocdn.com/@google/genai@^1.27.0";
// Assuming the serverless function can import from the parent directory.
import type { DrashaLength, RabbinicStyle, TorahPortion } from '../types';

// This function signature is designed to be compatible with modern edge runtimes (Vercel, Netlify, etc.)
export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { torahPortion, length, style } = (await req.json()) as {
      torahPortion: TorahPortion;
      length: DrashaLength;
      style: RabbinicStyle | string;
    };

    if (!process.env.API_KEY) {
      // This error will now appear in server logs, not the user's browser console.
      console.error("API_KEY is not configured on the server.");
      return new Response(JSON.stringify({ error: 'The application is not configured correctly. Please contact the administrator.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const drashaText = response.text;

    return new Response(JSON.stringify({ drasha: drashaText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/generate:", error);
    return new Response(JSON.stringify({ error: 'The AI model failed to generate a response.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
