import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { TOOLS_CONSTANTS } from '../constants/toolsConstants';
import { LOG_CONSTANTS } from '../constants/logConstants';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function searchWeb(req: Request, res: Response) {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: TOOLS_CONSTANTS.ERROR_QUERY_REQUIRED });
    }

    const response = await ai.models.generateContent({
      model: TOOLS_CONSTANTS.SEARCH_MODEL,
      contents: TOOLS_CONSTANTS.BUILD_SEARCH_PROMPT(query),
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const textOutput = response.text || '';
    const searchChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const webSources = searchChunks
      .map((c: any) => ({
        title: c.web?.title || TOOLS_CONSTANTS.DEFAULT_REFERENCE_TITLE,
        url: c.web?.uri || '',
      }))
      .filter((s: any) => s.url);

    res.json({
      summary: textOutput,
      sources: webSources,
      queriedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(LOG_CONSTANTS.TOOLS_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || TOOLS_CONSTANTS.ERROR_SEARCH_FAILED });
  }
}
