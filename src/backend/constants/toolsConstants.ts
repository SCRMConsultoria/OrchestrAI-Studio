/**
 * Tools Controller Constants
 */

export const TOOLS_CONSTANTS = {
  SEARCH_MODEL: 'gemini-3.1-flash-lite',
  DEFAULT_REFERENCE_TITLE: 'Referência Web',
  ERROR_QUERY_REQUIRED: 'Query is required',
  ERROR_SEARCH_FAILED: 'Erro na pesquisa externa',

  BUILD_SEARCH_PROMPT: (query: string) =>
    `Pesquise informações atualizadas e confiáveis sobre: "${query}". Resuma os principais fatos em 3 a 4 tópicos objetivos com dados concretos.`,
} as const;
