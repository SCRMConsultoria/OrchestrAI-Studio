export type ModelProvider = 'google' | 'openai' | 'anthropic' | 'custom';

export type UserRole = 'admin' | 'architect' | 'operator' | 'auditor' | 'finance';

export type ThemeMode = 'cockpit' | 'saas' | 'minimal' | 'custom';

export interface ModelDescriptor {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  contextWindow: number;
  supportsTools: boolean;
  supportsVision: boolean;
  badge: string;
}

export type NodeType = 'trigger' | 'llm' | 'tool' | 'guardrail' | 'condition' | 'output';

export interface CanvasNode {
  id: string;
  type: NodeType;
  title: string;
  x: number;
  y: number;
  config: {
    modelId?: string;
    provider?: ModelProvider;
    temperature?: number;
    topP?: number;
    topK?: number;
    promptTemplate?: string;
    selectedTools?: ('googleSearch' | 'pythonSandbox' | 'calculator' | 'webScraper')[];
    guardrails?: {
      blockPromptInjection: boolean;
      redactPii: boolean;
      blockedKeywords: string[];
      maxTokenCeiling: number;
    };
    conditionExpr?: string;
    triggerType?: 'voice' | 'text' | 'webhook';
    outputFormat?: 'markdown' | 'json' | 'voice_speech';
  };
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  modelId: string;
  provider: ModelProvider;
  systemInstruction: string;
  temperature: number;
  topP: number;
  topK: number;
  tools: ('googleSearch' | 'pythonSandbox' | 'calculator' | 'webScraper')[];
  guardrails: {
    blockPromptInjection: boolean;
    redactPii: boolean;
    blockedKeywords: string[];
    maxTokenCeiling: number;
  };
  voiceConfig: {
    voiceName: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
    speed: number;
    pitch: number;
  };
  currentVersion: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  description: string;
  mode: 'sequential' | 'parallel' | 'supervisor';
  agentIds: string[];
  supervisorAgentId?: string;
  aggregationPrompt?: string;
}

export interface ExecutionLogItem {
  id: string;
  runId: string;
  agentId: string;
  agentName: string;
  avatar: string;
  model: string;
  timestamp: string;
  status: 'pending' | 'thinking' | 'tool_call' | 'completed' | 'error';
  stageName: string;
  inputContent: string;
  outputContent: string;
  toolInvocations?: {
    toolName: string;
    query?: string;
    resultSnippet?: string;
    sources?: { title: string; url: string }[];
  }[];
  metrics: {
    durationMs: number;
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowTitle: string;
  userQuery: string;
  mode: 'sequential' | 'parallel' | 'supervisor';
  startedAt: string;
  finishedAt?: string;
  totalDurationMs: number;
  totalCostUsd: number;
  totalTokens: number;
  logs: ExecutionLogItem[];
  finalOutput: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'aborted';
  executedBy: {
    userId: string;
    userName: string;
    userRole: UserRole;
  };
}

export interface AgentVersion {
  versionId: string;
  agentId: string;
  versionNumber: string;
  commitMessage: string;
  createdAt: string;
  authorEmail: string;
  nodesSnapshot: CanvasNode[];
  edgesSnapshot: CanvasEdge[];
  evalScoreAvg: number;
  isProduction: boolean;
}

export interface EvaluationCase {
  id: string;
  title: string;
  inputPrompt: string;
  expectedKeywords: string[];
  rubricCriteria: string[];
  maxLatencyMs: number;
  maxCostUsd: number;
}

export interface EvaluationResult {
  caseId: string;
  caseTitle: string;
  score: number;
  passed: boolean;
  actualOutput: string;
  feedback: string;
  latencyMs: number;
  costUsd: number;
  criteriaBreakdown: { criterion: string; score: number; notes: string }[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  monthlyBudgetCapUsd: number;
  currentMonthSpentUsd: number;
  createdAt: string;
  lastLoginAt: string;
  avatarUrl?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  period: string;
  tokensBilled: number;
  amountUsd: number;
  marginProfitUsd: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export interface CustomThemeSettings {
  bg: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  accent: string;
  accentHover: string;
  text: string;
  textMuted: string;
  radius: number;
}
