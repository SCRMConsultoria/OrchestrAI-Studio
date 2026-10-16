import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

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
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Pesquise informações atualizadas e confiáveis sobre: "${query}". Resuma os principais fatos em 3 a 4 tópicos objetivos com dados concretos.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const textOutput = response.text || '';
    const searchChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const webSources = searchChunks
      .map((c: any) => ({
        title: c.web?.title || 'Referência Web',
        url: c.web?.uri || '',
      }))
      .filter((s: any) => s.url);

    res.json({
      summary: textOutput,
      sources: webSources,
      queriedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Tools controller search error:', error);
    res.status(500).json({ error: error.message || 'Erro na pesquisa externa' });
  }
}
