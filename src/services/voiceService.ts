/**
 * Voice Service: Bidirectional Voice Interaction
 * - Speech-to-Text (STT) via Web Speech API
 * - Text-to-Speech (TTS) via Server-Side Gemini 3.8 Flash Lite TTS + Web Speech fallback
 */

export class VoiceService {
  private recognition: any = null;
  private isListening = false;
  private currentAudioElement: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'pt-BR';
      }
    }
  }

  public isSpeechSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Reconhecimento de fala não suportado neste navegador.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        onResult(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Erro ao capturar áudio do microfone.');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Falha ao iniciar microfone.');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
      this.isListening = false;
    }
  }

  /**
   * Synthesize and play agent speech.
   * Attempts server Gemini 3.8 Flash Lite TTS first, with Web Speech Synthesis fallback.
   */
  public async speakText(
    text: string,
    voiceName: string = 'Kore',
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stopSpeaking();

    if (onStart) onStart();

    // 1. Try server-side Gemini TTS
    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          this.currentAudioElement = audio;
          audio.onended = () => {
            this.currentAudioElement = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            this.fallbackWebSpeech(text, onEnd);
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback
    }

    // 2. Fallback to Web Speech Synthesis
    this.fallbackWebSpeech(text, onEnd);
  }

  private fallbackWebSpeech(text: string, onEnd?: () => void) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
