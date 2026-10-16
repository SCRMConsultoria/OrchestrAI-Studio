/**
 * Constants for the Evals Controller and Enterprise Benchmark Evaluator
 */

export const EVALS_CONSTANTS = {
  DEFAULT_MODEL: 'gemini-3.1-flash-lite',
  DEFAULT_TEMPERATURE: 0.2,
  DEFAULT_MAX_LATENCY_MS: 5000,
  DEFAULT_ACTUAL_LATENCY_MS: 1200,
  DEFAULT_MAX_COST_USD: 0.05,
  DEFAULT_ACTUAL_COST_USD: 0.002,
  PASSING_SCORE_THRESHOLD: 75,
  RESPONSE_MIME_TYPE: 'application/json',

  DEFAULT_RUBRIC_CRITERIA: [
    'Aderência à instrução',
    'Completude factual',
    'Ausência de alucinações',
  ] as string[],

  FALLBACK_FEEDBACK: 'Resposta atende aos critérios da rubrica de avaliação.',
  DEFAULT_FEEDBACK: 'Avaliação concluída.',
  ERROR_RUNNING_EVALUATION: 'Erro ao rodar avaliação',

  JUDGE_PROMPT_HEADER: `Você é um avaliador rigoroso de IA de nível empresarial.
Avalie a resposta gerada por um modelo de acordo com os critérios estabelecidos.`,

  BUILD_JUDGE_PROMPT: (params: {
    inputPrompt: string;
    actualOutput: string;
    expectedOutputSubstring?: string;
    rubricCriteria: string[];
  }) => {
    return `${EVALS_CONSTANTS.JUDGE_PROMPT_HEADER}

Prompt do Usuário:
"${params.inputPrompt}"

Resposta Gerada pelo Modelo:
"${params.actualOutput}"

${params.expectedOutputSubstring ? `Conteúdo esperado / Palavras-chave obrigatórias:\n"${params.expectedOutputSubstring}"\n` : ''}

Critérios da Rubrica:
${params.rubricCriteria.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}

Forneça sua avaliação em formato JSON puro com:
{
  "score": <número inteiro de 0 a 100>,
  "passed": <booleano, true se score >= 75>,
  "feedback": "<explicação concisa de 1 a 2 frases>",
  "criteriaBreakdown": [
    { "criterion": "<nome do critério>", "score": <0 a 100>, "notes": "<análise>" }
  ]
}`;
  },
} as const;
