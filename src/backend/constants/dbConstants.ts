/**
 * Database & API Error and Response Message Constants
 */

export const DB_CONSTANTS = {
  // Database controller HTTP error responses
  ERROR_DB_STATUS: 'Erro ao verificar status do banco de dados',
  ERROR_LOAD_DATA: 'Erro ao carregar dados do banco',
  ERROR_LOAD_AGENTS: 'Erro ao carregar agentes',
  ERROR_SAVE_AGENT: 'Erro ao salvar agente no banco',
  ERROR_DELETE_AGENT: 'Erro ao remover agente do banco',
  ERROR_LOAD_WORKFLOWS: 'Erro ao carregar fluxos de trabalho',
  ERROR_SAVE_WORKFLOW: 'Erro ao salvar fluxo de trabalho',
  ERROR_SAVE_RUN: 'Erro ao registrar execução de fluxo',
  ERROR_SAVE_USER: 'Erro ao salvar conta de usuário',
  ERROR_SAVE_EVAL: 'Erro ao salvar caso de avaliação',
  ERROR_SAVE_VERSION: 'Erro ao salvar versão do agente',

  // Database engine names
  ENGINE_POSTGRES: 'PostgreSQL',
  ENGINE_MEMORY_CACHE: 'In-Memory Resilient Cache',
  DEFAULT_DB_NAME: 'orchestrai_db',
  DEFAULT_DB_USER: 'postgres',
} as const;
