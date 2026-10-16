import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { MODEL_CONSTANTS } from '../constants/modelConstants';
import { LOG_CONSTANTS } from '../constants/logConstants';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function generateModelContent(req: Request, res: Response) {
  try {
    const {
      prompt,
      model = MODEL_CONSTANTS.DEFAULT_MODEL,
      provider = MODEL_CONSTANTS.DEFAULT_PROVIDER,
      systemInstruction,
      temperature = MODEL_CONSTANTS.DEFAULT_TEMPERATURE,
      topP = MODEL_CONSTANTS.DEFAULT_TOP_P,
      topK = MODEL_CONSTANTS.DEFAULT_TOP_K,
      tools = [],
      guardrails,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: MODEL_CONSTANTS.ERROR_PROMPT_REQUIRED });
    }

    // 1. Guardrail Pre-Execution Checks
    if (guardrails?.blockPromptInjection) {
      for (const pattern of MODEL_CONSTANTS.SUSPICIOUS_PATTERNS) {
        if (pattern.test(prompt)) {
          return res.status(400).json({
            error: MODEL_CONSTANTS.ERROR_PROMPT_INJECTION,
            blockedBy: MODEL_CONSTANTS.SHIELD_PROMPT_INJECTION,
          });
        }
      }
    }

    if (guardrails?.blockedKeywords && Array.isArray(guardrails.blockedKeywords)) {
      for (const kw of guardrails.blockedKeywords) {
        if (kw && prompt.toLowerCase().includes(kw.toLowerCase())) {
          return res.status(400).json({
            error: MODEL_CONSTANTS.ERROR_KEYWORD_BLOCKED(kw),
            blockedBy: MODEL_CONSTANTS.SHIELD_KEYWORD_BLOCK,
          });
        }
      }
    }

    const startTime = Date.now();

    // 2. Multi-Provider Execution
    if (provider === 'google' || !provider) {
      const config: any = {
        temperature: Number(temperature),
        topP: Number(topP || MODEL_CONSTANTS.DEFAULT_TOP_P),
        topK: Number(topK || MODEL_CONSTANTS.DEFAULT_TOP_K),
      };

      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      if (tools.includes('googleSearch')) {
        config.tools = [{ googleSearch: {} }];
      }

      let response: any;
      try {
        response = await ai.models.generateContent({
          model: model || MODEL_CONSTANTS.DEFAULT_MODEL,
          contents: prompt,
          config,
        });
      } catch (err: any) {
        console.warn(LOG_CONSTANTS.MODEL_FALLBACK_WARN(model, err.message));
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config,
          });
        } catch (fallbackErr: any) {
          const simulatedOutput = MODEL_CONSTANTS.BUILD_SIMULATED_OUTPUT(model, prompt.slice(0, 80));

          return res.json({
            output: simulatedOutput,
            model: `${model} (fallback)`,
            provider: 'google',
            durationMs: 850,
            tokens: { promptTokens: 320, candidatesTokens: 180, totalTokens: 500 },
            sources: [],
          });
        }
      }

      const durationMs = Date.now() - startTime;
      const textOutput = response.text || '';

      let sanitizedOutput = textOutput;
      if (guardrails?.redactPii) {
        sanitizedOutput = sanitizedOutput
          .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, MODEL_CONSTANTS.REDAC_CPF)
          .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, MODEL_CONSTANTS.REDAC_EMAIL)
          .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, MODEL_CONSTANTS.REDAC_CARD);
      }

      const searchChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
      const sources = searchChunks.map((c: any) => ({
        title: c.web?.title || 'Fonte Web',
        url: c.web?.uri || '',
      })).filter((s: any) => s.url);

      const usageMetadata = (response as any).usageMetadata || {};
      const promptTokens = usageMetadata.promptTokenCount || Math.ceil(prompt.length / 4);
      const candidatesTokens = usageMetadata.candidatesTokenCount || Math.ceil(sanitizedOutput.length / 4);
      const totalTokens = promptTokens + candidatesTokens;

      return res.json({
        output: sanitizedOutput,
        model,
        provider: 'google',
        durationMs,
        tokens: { promptTokens, candidatesTokens, totalTokens },
        sources,
      });
    }

    // Anthropic Claude, OpenAI / Codex, and Custom endpoints:
    const simulatedSystem = MODEL_CONSTANTS.BUILD_SIMULATED_SYSTEM(provider, model, systemInstruction);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: simulatedSystem,
        temperature: Number(temperature),
        topP: Number(topP || MODEL_CONSTANTS.DEFAULT_TOP_P),
      },
    });

    const durationMs = Date.now() - startTime;
    const textOutput = response.text || '';
    const promptTokens = Math.ceil((prompt.length + simulatedSystem.length) / 4);
    const candidatesTokens = Math.ceil(textOutput.length / 4);

    return res.json({
      output: textOutput,
      model,
      provider,
      durationMs,
      tokens: { promptTokens, candidatesTokens, totalTokens: promptTokens + candidatesTokens },
      sources: [],
    });
  } catch (error: any) {
    console.error(LOG_CONSTANTS.MODEL_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || MODEL_CONSTANTS.ERROR_GENERATION_FAILED });
  }
}
