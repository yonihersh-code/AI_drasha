import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { torahPortion, length, style, specificTopic } = req.body;

    if (!process.env.API_KEY) {
      console.error("API_KEY is not configured on the server.");
      return res.status(500).json({ error: 'The application is not configured correctly. Please contact the administrator.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const topicInstruction = specificTopic
      ? `\n**Specific Topic to Include:** ${specificTopic}`
      : '';

    const prompt = `
      Generate a drasha for a synagogue service.

      **Torah Portion / Chag:** ${torahPortion}
      **Desired Length:** ${length}
      **In the style of:** ${style}${topicInstruction}

      The drasha should be inspiring, insightful, and appropriate for a diverse congregation.
      It should connect the themes of the Torah portion/chag to contemporary life.
      ${specificTopic ? 'It is crucial that you incorporate and focus on the specific topic mentioned above.' : ''}
      Please structure it with an introduction, a body with a few key points, and a concluding message.
      
      IMPORTANT: When quoting from Tanakh, Talmud, or other Jewish sources, you MUST provide the original Hebrew text, followed by an English translation and the source reference in parentheses.
      For example: a quote should be formatted like this: "כִּ֤י מִצִּיּוֹן֙ תֵּצֵ֣א תוֹרָ֔ה וּדְבַר־יְהוָ֖ה מִירוּשָׁלִָֽם׃" - "For out of Zion shall go forth the law, and the word of the LORD from Jerusalem." (Isaiah 2:3).

      Do not include a title for the drasha.
      Format the output in Markdown.
    `;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            const data = `data: ${JSON.stringify({ text })}\n\n`;
            res.write(data);
        }
    }
    
    res.end();

  } catch (error) {
    console.error("Error in /api/generate:", error);
    // Ensure we don't try to write to a stream that's already closed.
    if (!res.writableEnded) {
      res.status(500).json({ error: 'The AI model failed to generate a response.' });
    }
  }
}
