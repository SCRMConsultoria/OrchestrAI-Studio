/**
 * Voice Controller Constants
 */

export const BACKEND_VOICE_CONSTANTS = {
  DEFAULT_VOICE_MODEL: 'gemini-3.8-flash-lite-tts',
  DEFAULT_VOICE_NAME: 'Kore',
  AUDIO_MIME_TYPE: 'audio/wav',
  MAX_TEXT_SLICE: 1000,

  ERROR_TEXT_REQUIRED: 'Text is required for TTS',
  ERROR_NO_AUDIO: 'Nenhum áudio gerado pelo modelo',
  ERROR_TTS_FAILED: 'Erro na síntese de áudio',
} as const;
