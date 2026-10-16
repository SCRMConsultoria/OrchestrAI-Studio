/**
 * Log and Diagnostic Message Constants
 * Centralizes all terminal and logger messages to eliminate raw string literals.
 */

export const LOG_CONSTANTS = {
  // Controller error log messages
  VOICE_CONTROLLER_ERROR: 'Error in voice controller:',
  EVALS_CONTROLLER_ERROR: 'Evals controller error:',
  TOOLS_CONTROLLER_ERROR: 'Tools controller search error:',
  MODEL_CONTROLLER_ERROR: 'Error in model controller:',
  DATABASE_CONTROLLER_ERROR: 'Error in database controller:',

  // Model fallback logs
  MODEL_FALLBACK_WARN: (model: string, msg: string) =>
    `Primary model ${model} failed, attempting fallback: ${msg}`,

  // Database lifecycle logs
  POSTGRES_POOL_ERROR: '[Postgres Pool Error]:',
  POSTGRES_CONNECTION_NOTICE: '[Postgres Connection Notice]:',
  POSTGRES_CONNECTED: '[Postgres Connected]: Successfully established connection to PostgreSQL database.',
  POSTGRES_SCHEMA_SYNCED: '[Postgres Schema]: Schema checked and synchronized successfully.',
  POSTGRES_SEEDING_START: '[Postgres Seeding]: Database empty. Seeding initial baseline datasets...',
  POSTGRES_SEEDING_COMPLETE: '[Postgres Seeding]: Baseline datasets successfully seeded.',
  POSTGRES_SEEDING_WARN: '[Postgres Seeding Warning]:',
  POSTGRES_MIGRATION_ERROR: '[Postgres Migration Error]:',
  POSTGRES_INIT_WARN: '[Postgres Init Warning]:',
  POSTGRES_AGENT_SAVE_ERROR: '[Postgres Agent Save Error]:',
  POSTGRES_AGENT_DELETE_ERROR: '[Postgres Agent Delete Error]:',
  POSTGRES_WORKFLOW_SAVE_ERROR: '[Postgres Workflow Save Error]:',
  POSTGRES_RUN_SAVE_ERROR: '[Postgres Run Save Error]:',
  POSTGRES_USER_SAVE_ERROR: '[Postgres User Save Error]:',
  POSTGRES_IN_MEMORY_NOTICE: '[Database Notice]: No DATABASE_URL provided. Operating with high-resilience in-memory store.',

  // Server startup logs
  SERVER_START: (port: number | string) =>
    `OrchestrAI Studio (Modular Backend/Frontend) running on port ${port}`,
} as const;
