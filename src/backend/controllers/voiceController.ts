import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { BACKEND_VOICE_CONSTANTS } from '../constants/voiceConstants';
import { LOG_CONSTANTS } from '../constants/logConstants';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function synthesizeSpeech(req: Request, res: Response) {
  try {
    const { text, voiceName = BACKEND_VOICE_CONSTANTS.DEFAULT_VOICE_NAME } = req.body;
    if (!text) {
      return res.status(400).json({ error: BACKEND_VOICE_CONSTANTS.ERROR_TEXT_REQUIRED });
    }

    const spokenText = text.slice(0, BACKEND_VOICE_CONSTANTS.MAX_TEXT_SLICE);

    const response = await ai.models.generateContent({
      model: BACKEND_VOICE_CONSTANTS.DEFAULT_VOICE_MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: spokenText }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || BACKEND_VOICE_CONSTANTS.DEFAULT_VOICE_NAME },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: BACKEND_VOICE_CONSTANTS.ERROR_NO_AUDIO });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: BACKEND_VOICE_CONSTANTS.AUDIO_MIME_TYPE,
      voiceName,
    });
  } catch (error: any) {
    console.error(LOG_CONSTANTS.VOICE_CONTROLLER_ERROR, error);
    res.status(500).json({ error: error.message || BACKEND_VOICE_CONSTANTS.ERROR_TTS_FAILED });
  }
}
