import {
  AgentConfig,
  WorkflowDefinition,
  WorkflowRun,
  EvaluationCase,
  AgentVersion,
  UserAccount,
  ModelDescriptor,
  InvoiceItem,
} from '../../../types';

export interface AppDatabasePayload {
  models: ModelDescriptor[];
  agents: AgentConfig[];
  workflows: WorkflowDefinition[];
  runs: WorkflowRun[];
  evals: EvaluationCase[];
  versions: AgentVersion[];
  users: UserAccount[];
  invoices: InvoiceItem[];
}

export class ApiService {
  public static async loadInitialData(): Promise<AppDatabasePayload | null> {
    try {
      const res = await fetch('/api/data/all');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch data from database API:', e);
    }
    return null;
  }

  public static async getDbStatus(): Promise<{ connected: boolean; engine: string } | null> {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignored
    }
    return null;
  }

  public static async saveAgent(agent: AgentConfig): Promise<void> {
    try {
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
    } catch (e) {
      console.warn('Failed to save agent to database:', e);
    }
  }

  public static async deleteAgent(agentId: string): Promise<void> {
    try {
      await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Failed to delete agent from database:', e);
    }
  }

  public static async saveWorkflow(workflow: WorkflowDefinition): Promise<void> {
    try {
      await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });
    } catch (e) {
      console.warn('Failed to save workflow to database:', e);
    }
  }

  public static async saveRun(run: WorkflowRun): Promise<void> {
    try {
      await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(run),
      });
    } catch (e) {
      console.warn('Failed to record run to database:', e);
    }
  }

  public static async saveUser(user: UserAccount): Promise<void> {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    } catch (e) {
      console.warn('Failed to persist user to database:', e);
    }
  }

  public static async saveEval(evalCase: EvaluationCase): Promise<void> {
    try {
      await fetch('/api/evals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evalCase),
      });
    } catch (e) {
      console.warn('Failed to save eval to database:', e);
    }
  }

  public static async saveVersion(version: AgentVersion): Promise<void> {
    try {
      await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(version),
      });
    } catch (e) {
      console.warn('Failed to save version to database:', e);
    }
  }
}
