/**
 * Model Controller and Guardrail Constants
 */

export const MODEL_CONSTANTS = {
  DEFAULT_MODEL: 'gemini-3.8-flash',
  DEFAULT_PROVIDER: 'google',
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_TOP_P: 0.95,
  DEFAULT_TOP_K: 40,

  SUSPICIOUS_PATTERNS: [
    /ignore previous instructions/i,
    /system prompt/i,
    /jailbreak/i,
    /developer mode/i,
  ],

  ERROR_PROMPT_REQUIRED: 'Prompt is required',
  ERROR_PROMPT_INJECTION: 'Guardrail violation: Potencial injeção de prompt detectada.',
  ERROR_KEYWORD_BLOCKED: (kw: string) => `Guardrail violation: A palavra-chave '${kw}' foi bloqueada pela política de segurança.`,
  ERROR_UNKNOWN_PROVIDER: (p: string) => `Provedor de modelo '${p}' não configurado nesta versão.`,
  ERROR_GENERATION_FAILED: 'Erro na geração de conteúdo do modelo',

  SHIELD_PROMPT_INJECTION: 'PromptInjectionShield',
  SHIELD_KEYWORD_BLOCK: 'KeywordBlockShield',
} as const;
