/**
 * Voice Interaction Constants
 * Centralizes all messages, error codes, and default parameters for speech recognition and synthesis.
 */

export const VOICE_CONSTANTS = {
  // Locale & Audio defaults
  DEFAULT_LANGUAGE: 'pt-BR',
  DEFAULT_VOICE_NAME: 'Kore',
  DEFAULT_SPEECH_RATE: 1.0,
  MAX_SYNTHESIS_TEXT_LENGTH: 1000,
  AUDIO_MIME_TYPE: 'audio/wav',

  // Error Messages
  ERROR_UNSUPPORTED_BROWSER: 'Reconhecimento de fala não suportado neste navegador.',
  ERROR_MICROPHONE_CAPTURE: 'Erro ao capturar áudio do microfone.',
  ERROR_MICROPHONE_START_FAILED: 'Falha ao iniciar microfone.',
  ERROR_TTS_FAILED: 'Falha na síntese de áudio.',
  ERROR_NO_AUDIO_GENERATED: 'Nenhum áudio gerado pelo modelo.',
  ERROR_TEXT_REQUIRED: 'Text is required for TTS',

  // API Endpoints
  TTS_ENDPOINT: '/api/voice/tts',
} as const;
