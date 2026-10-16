import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AVAILABLE_MODELS,
  INITIAL_AGENTS,
  INITIAL_WORKFLOWS,
  INITIAL_RECENT_RUNS,
  INITIAL_EVAL_CASES,
  INITIAL_VERSIONS,
  INITIAL_USERS,
  INITIAL_INVOICES,
} from '../../data/initialData';
import {
  ModelDescriptor,
  AgentConfig,
  WorkflowDefinition,
  EvaluationCase,
  AgentVersion,
  UserAccount,
  InvoiceItem,
  WorkflowRun,
} from '../../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database memory fallback store for resilience when DB is disconnected
class DatabaseStore {
  public models: ModelDescriptor[] = [...AVAILABLE_MODELS];
  public agents: AgentConfig[] = [...INITIAL_AGENTS];
  public workflows: WorkflowDefinition[] = [...INITIAL_WORKFLOWS];
  public runs: WorkflowRun[] = [...INITIAL_RECENT_RUNS];
  public evals: EvaluationCase[] = [...INITIAL_EVAL_CASES];
  public versions: AgentVersion[] = [...INITIAL_VERSIONS];
  public users: UserAccount[] = [...INITIAL_USERS];
  public invoices: InvoiceItem[] = [...INITIAL_INVOICES];
}

const memoryStore = new DatabaseStore();

export class DatabaseClient {
  private pool: pg.Pool | null = null;
  private isConnected: boolean = false;
  private dbEngine: string = 'in-memory-fallback';

  constructor() {
    this.initPool();
  }

  private initPool() {
    const connectionString =
      process.env.DATABASE_URL ||
      (process.env.POSTGRES_HOST
        ? `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'orchestrai_db'}`
        : null);

    if (connectionString) {
      try {
        this.pool = new pg.Pool({
          connectionString,
          connectionTimeoutMillis: 3000,
          idleTimeoutMillis: 10000,
          ssl:
            process.env.NODE_ENV === 'production' &&
            !connectionString.includes('localhost') &&
            !connectionString.includes('postgres:')
              ? { rejectUnauthorized: false }
              : false,
        });

        this.pool.on('error', (err) => {
          console.warn('[Postgres Pool Error]:', err.message);
          this.isConnected = false;
        });

        this.pool.connect((err, client, release) => {
          if (err) {
            console.warn('[Postgres Connection Notice]:', err.message, '- Using resilient in-memory store.');
            this.isConnected = false;
          } else {
            this.isConnected = true;
            this.dbEngine = 'PostgreSQL';
            release();
            console.log('[Postgres Connected]: Successfully established connection to PostgreSQL database.');
            this.runMigrations();
          }
        });
      } catch (err: any) {
        console.warn('[Postgres Init Warning]:', err.message);
      }
    } else {
      console.log('[Database Notice]: No DATABASE_URL provided. Operating with high-resilience in-memory store.');
    }
  }

  private async runMigrations() {
    if (!this.pool || !this.isConnected) return;
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        await this.pool.query(schemaSql);
        console.log('[Postgres Schema]: Schema checked and synchronized successfully.');
      }
      await this.seedIfEmpty();
    } catch (err: any) {
      console.error('[Postgres Migration Error]:', err.message);
    }
  }

  private async seedIfEmpty() {
    if (!this.pool || !this.isConnected) return;
    try {
      const res = await this.pool.query('SELECT COUNT(*) FROM agents');
      if (parseInt(res.rows[0].count, 10) === 0) {
        console.log('[Postgres Seeding]: Database empty. Seeding initial baseline datasets...');
        for (const m of AVAILABLE_MODELS) {
          await this.pool.query(
            `INSERT INTO models (id, name, provider, description, input_cost_per_1m, output_cost_per_1m, context_window, supports_tools, supports_vision, badge)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
            [m.id, m.name, m.provider, m.description, m.inputCostPer1M, m.outputCostPer1M, m.contextWindow, m.supportsTools, m.supportsVision, m.badge]
          );
        }
        for (const a of INITIAL_AGENTS) {
          await this.pool.query(
            `INSERT INTO agents (id, name, role, avatar, description, model_id, provider, system_instruction, temperature, top_p, top_k, tools, guardrails, voice_config, current_version, nodes, edges)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) ON CONFLICT (id) DO NOTHING`,
            [
              a.id,
              a.name,
              a.role,
              a.avatar,
              a.description,
              a.modelId,
              a.provider,
              a.systemInstruction,
              a.temperature,
              a.topP,
              a.topK,
              JSON.stringify(a.tools),
              JSON.stringify(a.guardrails),
              JSON.stringify(a.voiceConfig),
              a.currentVersion,
              JSON.stringify(a.nodes),
              JSON.stringify(a.edges),
            ]
          );
        }
        for (const w of INITIAL_WORKFLOWS) {
          await this.pool.query(
            `INSERT INTO workflows (id, title, description, mode, agent_ids, supervisor_agent_id, aggregation_prompt)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
            [
              w.id,
              w.title,
              w.description,
              w.mode,
              JSON.stringify(w.agentIds),
              w.supervisorAgentId || null,
              w.aggregationPrompt || null,
            ]
          );
        }
        for (const u of INITIAL_USERS) {
          await this.pool.query(
            `INSERT INTO users (id, name, email, role, status, monthly_budget_cap_usd, current_month_spent_usd, avatar_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
            [
              u.id,
              u.name,
              u.email,
              u.role,
              u.status,
              u.monthlyBudgetCapUsd,
              u.currentMonthSpentUsd,
              u.avatarUrl || null,
            ]
          );
        }
        console.log('[Postgres Seeding]: Baseline datasets successfully seeded.');
      }
    } catch (err: any) {
      console.warn('[Postgres Seeding Warning]:', err.message);
    }
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      engine: this.isConnected ? 'PostgreSQL' : 'In-Memory Resilient Cache',
      timestamp: new Date().toISOString(),
      counts: {
        models: memoryStore.models.length,
        agents: memoryStore.agents.length,
        workflows: memoryStore.workflows.length,
        runs: memoryStore.runs.length,
        evals: memoryStore.evals.length,
        versions: memoryStore.versions.length,
        users: memoryStore.users.length,
        invoices: memoryStore.invoices.length,
      },
    };
  }

  // Generic Data Access APIs
  public async getAllData() {
    return {
      models: memoryStore.models,
      agents: memoryStore.agents,
      workflows: memoryStore.workflows,
      runs: memoryStore.runs,
      evals: memoryStore.evals,
      versions: memoryStore.versions,
      users: memoryStore.users,
      invoices: memoryStore.invoices,
    };
  }

  // Agents CRUD
  public async getAgents(): Promise<AgentConfig[]> {
    return memoryStore.agents;
  }

  public async saveAgent(agent: AgentConfig): Promise<AgentConfig> {
    const idx = memoryStore.agents.findIndex((a) => a.id === agent.id);
    if (idx >= 0) {
      memoryStore.agents[idx] = agent;
    } else {
      memoryStore.agents.push(agent);
    }

    if (this.pool && this.isConnected) {
      try {
        await this.pool.query(
          `INSERT INTO agents (id, name, role, avatar, description, model_id, provider, system_instruction, temperature, top_p, top_k, tools, guardrails, voice_config, current_version, nodes, edges, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             role = EXCLUDED.role,
             avatar = EXCLUDED.avatar,
             description = EXCLUDED.description,
             model_id = EXCLUDED.model_id,
             provider = EXCLUDED.provider,
             system_instruction = EXCLUDED.system_instruction,
             temperature = EXCLUDED.temperature,
             top_p = EXCLUDED.top_p,
             top_k = EXCLUDED.top_k,
             tools = EXCLUDED.tools,
             guardrails = EXCLUDED.guardrails,
             voice_config = EXCLUDED.voice_config,
             current_version = EXCLUDED.current_version,
             nodes = EXCLUDED.nodes,
             edges = EXCLUDED.edges,
             updated_at = NOW()`,
          [
            agent.id,
            agent.name,
            agent.role,
            agent.avatar,
            agent.description,
            agent.modelId,
            agent.provider,
            agent.systemInstruction,
            agent.temperature,
            agent.topP,
            agent.topK,
            JSON.stringify(agent.tools),
            JSON.stringify(agent.guardrails),
            JSON.stringify(agent.voiceConfig),
            agent.currentVersion,
            JSON.stringify(agent.nodes),
            JSON.stringify(agent.edges),
          ]
        );
      } catch (err: any) {
        console.warn('[Postgres Agent Save Error]:', err.message);
      }
    }
    return agent;
  }

  public async deleteAgent(agentId: string): Promise<boolean> {
    memoryStore.agents = memoryStore.agents.filter((a) => a.id !== agentId);
    if (this.pool && this.isConnected) {
      try {
        await this.pool.query('DELETE FROM agents WHERE id = $1', [agentId]);
      } catch (err: any) {
        console.warn('[Postgres Agent Delete Error]:', err.message);
      }
    }
    return true;
  }

  // Workflows CRUD
  public async getWorkflows(): Promise<WorkflowDefinition[]> {
    return memoryStore.workflows;
  }

  public async saveWorkflow(workflow: WorkflowDefinition): Promise<WorkflowDefinition> {
    const idx = memoryStore.workflows.findIndex((w) => w.id === workflow.id);
    if (idx >= 0) {
      memoryStore.workflows[idx] = workflow;
    } else {
      memoryStore.workflows.push(workflow);
    }

    if (this.pool && this.isConnected) {
      try {
        await this.pool.query(
          `INSERT INTO workflows (id, title, description, mode, agent_ids, supervisor_agent_id, aggregation_prompt, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             mode = EXCLUDED.mode,
             agent_ids = EXCLUDED.agent_ids,
             supervisor_agent_id = EXCLUDED.supervisor_agent_id,
             aggregation_prompt = EXCLUDED.aggregation_prompt,
             updated_at = NOW()`,
          [
            workflow.id,
            workflow.title,
            workflow.description,
            workflow.mode,
            JSON.stringify(workflow.agentIds),
            workflow.supervisorAgentId || null,
            workflow.aggregationPrompt || null,
          ]
        );
      } catch (err: any) {
        console.warn('[Postgres Workflow Save Error]:', err.message);
      }
    }
    return workflow;
  }

  // Workflow Runs
  public async saveRun(run: WorkflowRun): Promise<WorkflowRun> {
    memoryStore.runs.unshift(run);
    if (this.pool && this.isConnected) {
      try {
        await this.pool.query(
          `INSERT INTO workflow_runs (id, workflow_id, workflow_title, user_query, mode, started_at, finished_at, total_duration_ms, total_cost_usd, total_tokens, logs, final_output, status, executed_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            run.id,
            run.workflowId,
            run.workflowTitle,
            run.userQuery,
            run.mode,
            run.startedAt,
            run.finishedAt || null,
            run.totalDurationMs,
            run.totalCostUsd,
            run.totalTokens,
            JSON.stringify(run.logs),
            run.finalOutput,
            run.status,
            JSON.stringify(run.executedBy),
          ]
        );
      } catch (err: any) {
        console.warn('[Postgres Run Save Error]:', err.message);
      }
    }
    return run;
  }

  // Users CRUD
  public async saveUser(user: UserAccount): Promise<UserAccount> {
    const idx = memoryStore.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      memoryStore.users[idx] = user;
    } else {
      memoryStore.users.push(user);
    }

    if (this.pool && this.isConnected) {
      try {
        await this.pool.query(
          `INSERT INTO users (id, name, email, role, status, monthly_budget_cap_usd, current_month_spent_usd, avatar_url, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             email = EXCLUDED.email,
             role = EXCLUDED.role,
             status = EXCLUDED.status,
             monthly_budget_cap_usd = EXCLUDED.monthly_budget_cap_usd,
             current_month_spent_usd = EXCLUDED.current_month_spent_usd,
             avatar_url = EXCLUDED.avatar_url,
             last_login_at = NOW()`,
          [
            user.id,
            user.name,
            user.email,
            user.role,
            user.status,
            user.monthlyBudgetCapUsd,
            user.currentMonthSpentUsd,
            user.avatarUrl || null,
          ]
        );
      } catch (err: any) {
        console.warn('[Postgres User Save Error]:', err.message);
      }
    }
    return user;
  }

  // Evals
  public async saveEval(evalCase: EvaluationCase): Promise<EvaluationCase> {
    const idx = memoryStore.evals.findIndex((e) => e.id === evalCase.id);
    if (idx >= 0) {
      memoryStore.evals[idx] = evalCase;
    } else {
      memoryStore.evals.push(evalCase);
    }
    return evalCase;
  }

  // Versions
  public async saveVersion(version: AgentVersion): Promise<AgentVersion> {
    memoryStore.versions.unshift(version);
    return version;
  }
}

export const dbClient = new DatabaseClient();
