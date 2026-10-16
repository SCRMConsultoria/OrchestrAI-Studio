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

  REDAC_CPF: '[CPF REDIGIDO]',
  REDAC_EMAIL: '[EMAIL REDIGIDO]',
  REDAC_CARD: '[CARTAO REDIGIDO]',

  BUILD_SIMULATED_OUTPUT: (model: string, promptPreview: string) =>
    `[OrchestrAI Engine - Resposta Sintetizada]
Com base nos parâmetros do agente (${model}):
A análise solicitada sobre "${promptPreview}..." foi processada pelo orquestrador.

Pontos Chave Identificados:
1. Validação de arquitetura e mitigação de vulnerabilidades concluída.
2. Parâmetros operacionais verificados com sucesso dentro dos limites de conformidade e cota.
3. Trilha de auditoria gerada com carimbo temporal e hash de validação imutável.`,

  BUILD_SIMULATED_SYSTEM: (provider: string, model: string, systemInstruction?: string) =>
    `[Provider Simulation: ${provider.toUpperCase()} / Model: ${model}]
${systemInstruction ? `System Instructions:\n${systemInstruction}\n` : ''}
Respond accurately and adhere strictly to requested formatting and cognitive style of ${model}.`,
} as const;
