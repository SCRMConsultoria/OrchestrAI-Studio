# OrchestrAI Studio: Plataforma Corporativa de Orquestração, Engenharia Visual de Agentes e Governança de IA

OrchestrAI Studio é uma plataforma full-stack de classe empresarial para criação visual (drag-and-drop), parametrização multimodelos (Gemini, Claude, Codex/OpenAI, Llama), orquestração de pipelines complexos (sequencial, paralelo, supervisor), testes com prévia e avaliações automatizadas (evals), controle de versão de agentes com rollback, gestão financeira de custos e faturamento/vendas, além de administração robusta de usuários e controle de acesso (RBAC).

---

### Decisões Críticas e Requisitos Incorporados

> [!IMPORTANT]
> Atualização estrutural completa com base nas novas especificações fornecidas:
> 1. **Ecossistema Multimodelo Configurável**: Suporte nativo e adaptadores configuráveis para múltiplas famílias de modelos: Google Gemini (`gemini-3.8-flash`, `gemini-4-argon`, `gemini-3.1-flash-lite`), OpenAI / Codex (`gpt-4o`, `gpt-4o-mini`, `o1`), Anthropic (`claude-3-5-sonnet`, `claude-3-opus`), além de suporte para endpoints compatíveis com OpenAI/vLLM.
> 2. **Interface Visual Drag-and-Drop (Node Canvas)**: Canvas interativo com nós arrastáveis para desenhar a lógica de agentes, conectores de ferramentas (Busca Web, APIs, Python, Calculadora) e configuração de **Guardrails/Proteções Personalizadas** (filtros de segurança, restrição de tópicos, detecção de injeção de prompt e redação de PII).
> 3. **Sandbox de Prévias, Avaliações em Linha (Evals) e Controle de Versão**:
>    - Painel dividido de pré-visualização instantânea (Live Preview Sandbox).
>    - Configuração de critérios de avaliação automatizada (precisão factual, completude, toxicidade, latência máxima e aderência a schemas).
>    - Versionamento semântico completo dos agentes (`v1.0.0`, `v1.1.0`), histórico de commits, visualizador de diff e rollback instantâneo em 1 clique.
> 4. **Painel Financeiro & Vendas**: Gerenciador de custos de inferência em tempo real, precificação com markup para revenda/clientes, rastreamento de receita, consumo de créditos e emissão de relatórios/faturas.
> 5. **Gerenciamento de Contas e Usuários**: Administração completa de membros de equipe, atribuição de funções RBAC (Admin, Architect, Operator, Auditor, Financeiro), limites individuais de gastos e gestão de sessões.

---

## 1. Visão Geral e Conceito do Produto

### O que o Sistema Faz
O **OrchestrAI Studio** é o centro de comando definitivo para o ciclo de vida completo de agentes de IA:
- **Design & Lógica**: Componha o fluxo cognitivo do agente conectando blocos visuais de Entrada, Prompt de Sistema, Raciocínio LLM, Chamada de Ferramentas e Barreiras de Proteção (Guardrails).
- **Flexibilidade de Modelos**: Alterne dinamicamente o provedor do modelo por agente para otimizar equilíbrio entre custo, latência e inteligência.
- **Ciclo de Desenvolvimento Rápido**: Teste modificações imediatamente no sandbox de prévia, execute baterias de testes com notas automáticas (evals) e reverta versões caso um prompt degrade o resultado.
- **Operação e Governança**: Monitore em tempo real as conversas (via texto ou voz com STT/TTS), controle os custos e margens de vendas no painel financeiro e audite ações de cada usuário da organização.

---

## 2. Experiência do Usuário e Visual Design

### 1. Canvas Visual de Agentes (Drag & Drop Node Editor)
- **Barra de Nós**: Paleta lateral com blocos arrastáveis categorizados:
  - *Trigger/Entrada*: Entrada de Usuário, Comando de Voz, Webhook, Agendador.
  - *Modelos & Raciocínio*: Nó Gemini, Nó Claude, Nó Codex/OpenAI, Nó Custom LLM.
  - *Conectores de Ferramentas*: Busca Web em tempo real, Execução de Código Python, Leitor de Arquivos/Documentos, Calculadora, Chamadas de API REST.
  - *Lógica & Fluxo*: Condicional (Se/Senão), Roteador Semântico, Agregador Paralelo, Nó Supervisor.
  - *Guardrails & Segurança*: Barreira de Moderação, Bloqueio de PII/Dados Sensíveis, Detector de Jailbreak, Validador de Saída JSON.
- **Área de Trabalho Interativa**: Canvas infinito com zoom, pan, minimapa, alinhamento automático e cabos de conexão curvos com indicação de fluxo de dados.

### 2. Sandbox de Prévias & Suíte de Avaliações (Evals)
- **Split-View Interativo**: Visualize o grafo de nós à esquerda e o painel de teste ao vivo à direita.
- **Painel de Avaliações em Linha (Inline Evals)**:
  - Crie baterias de prompts de teste com resposta esperada (Ground Truth).
  - Execução em lote com geração de score (0 a 100%) baseado em métricas: Exatidão, Coerência, Latência, Custo e Aderência aos Guardrails.
  - Gráfico comparativo de desempenho entre versões do mesmo agente.

### 3. Controle de Versões e Histórico de Mudanças
- **Linha do Tempo de Versões**: Lista cronológica de releases (`v1.0.0`, `v1.0.1`, `v1.2.0-beta`).
- **Diff Visual**: Compare alterações de nós, parâmetros de temperatura e texto de prompts entre duas versões selecionadas.
- **Rollback Instantâneo**: Restauração da versão de produção com 1 clique.

### 4. Painel Financeiro e de Vendas (Billing & Revenue)
- **Visão de Custos (Despesas)**: Custos reais por token consumido separados por provedor (Google, OpenAI, Anthropic), latência média e agentes mais caros.
- **Visão de Vendas (Receitas & Margens)**:
  - Definição de planos de clientes (Free, Pro, Enterprise) e markup de precificação (% sobre o custo da API).
  - Gráficos de receita bruta, margem de lucro operacional e volume de créditos consumidos.
  - Tabela de faturas e histórico de recargas.

### 5. Central de Contas de Usuários e Equipes
- **Tabela de Usuários**: Nome, e-mail, função (Admin, Arquiteto de IA, Operador, Auditor, Gestor Financeiro), data do último acesso e cota máxima mensal de gastos.
- **Controles Administrativos**: Convidar novo membro, alterar permissões em tempo real, suspender acesso e revogar tokens de API.

### 6. Interface Multimodal por Voz e Temas
- **Voz Bidirecional**: Ditado com transcrição em tempo real (STT) e sintetização falada com seleção de vozes para os agentes (TTS).
- **4 Temas de Interface**:
  - *Cockpit Tech*: Estética terminal dark com superfícies em grafite e acentos esmeralda/ciano.
  - *Modern SaaS*: Minimalista claro de alta legibilidade corporativa.
  - *Minimal Slate*: Monocromático executivo balanceado.
  - *Custom Studio Freedom*: Paleta customizável pelo próprio usuário com sliders de matiz, acento e densidade.

---

## 3. Decisões de Produto e Arquitetura Técnica

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ORCHESTRAI STUDIO UI                             │
├─────────────────┬───────────────────────────┬───────────────────────────────┤
│    Navegação    │     Módulos Principais    │       Painel Lateral          │
│ - Canvas Visual │ - Visual Node Builder     │ - Live Preview Sandbox        │
│ - Workflows     │ - Multimodel Configurator │ - Inline Evals & Scorecards   │
│ - Analytics     │ - Guardrails Shield Studio│ - Real-time Execution Bus     │
│ - Financeiro    │ - Multiagent Orchestrator │ - Version Control & Diff View │
│ - Usuários/RBAC │ - Voice Command (STT/TTS) │ - Exportador PDF / CSV        │
└────────┬────────┴─────────────┬─────────────┴───────────────┬───────────────┘
         │                      │                             │
         ▼                      ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CORE APPLICATION STORE LAYER                         │
│  - useAgentGraphStore (Nós, conexões, guardrails, estado visual)            │
│  - useModelCatalogStore (Gemini, Claude, Codex/OpenAI, Llama)               │
│  - useVersionStore (Snapshots, tags semânticas, diffs, rollback)            │
│  - useBillingStore (Custos de inferência, markups, vendas, faturas)         │
│  - useUserManagementStore (Membros, papéis RBAC, limites orçamentários)     │
│  - useVoiceManager (Reconhecimento de fala e síntese de áudio)              │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FULL-STACK BACKEND SERVICES                           │
│                                                                             │
│  POST /api/orchestrator/run-graph    ──> Execução da malha de nós           │
│  POST /api/models/generate           ──> Proxy universal multimodelos       │
│  POST /api/tools/search              ──> Ferramenta de busca web em tempo   │
│  POST /api/evals/execute-suite       ──> Bateria de avaliações automáticas  │
│  POST /api/billing/calculate-margins ──> Consolidação financeira e métricas │
│  POST /api/voice/tts                 ──> Síntese de fala de alta fidelidade │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PERSISTÊNCIA, AUDITORIA & EXPORTAÇÃO                    │
│  - Base de Dados Estruturada (Agentes, Workflows, Versões, Logs, Faturas)   │
│  - Motor de Auditoria Criptográfica (Logs de execução imutáveis)            │
│  - Gerador de Relatórios Executivos em PDF e Planilhas em CSV               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelos de Dados Expandidos

```typescript
// Provedores e Catálogo de Modelos
export type ModelProvider = 'google' | 'openai' | 'anthropic' | 'custom';

export interface ModelDescriptor {
  id: string;
  name: string;
  provider: ModelProvider;
  contextWindow: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
}

// Nós do Canvas Visual de Agente
export interface CanvasNode {
  id: string;
  type: 'trigger' | 'llm' | 'tool' | 'guardrail' | 'condition' | 'output';
  title: string;
  position: { x: number; y: number };
  config: {
    modelId?: string;
    temperature?: number;
    topP?: number;
    promptTemplate?: string;
    selectedTools?: string[];
    guardrailRules?: {
      blockPromptInjection: boolean;
      redactPii: boolean;
      blockedKeywords: string[];
      maxTokenCeiling: number;
    };
    conditionExpr?: string;
  };
}

export interface CanvasEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

// Versão de Agente com Rollback
export interface AgentVersion {
  versionId: string;
  agentId: string;
  versionNumber: string; // Ex: "v1.2.0"
  commitMessage: string;
  createdAt: string;
  authorEmail: string;
  nodesSnapshot: CanvasNode[];
  edgesSnapshot: CanvasEdge[];
  evalScoreAvg?: number;
  isProduction: boolean;
}

// Suíte de Avaliações em Linha (Evals)
export interface EvaluationCase {
  id: string;
  inputPrompt: string;
  expectedOutputSubstring?: string;
  rubricCriteria: string[];
  maxLatencyMs: number;
  maxCostUsd: number;
}

export interface EvaluationRunResult {
  runId: string;
  versionId: string;
  executedAt: string;
  passRatePercentage: number;
  averageLatencyMs: number;
  totalCostUsd: number;
  caseResults: {
    caseId: string;
    passed: boolean;
    actualOutput: string;
    latencyMs: number;
    costUsd: number;
    notes: string;
  }[];
}

// Gestão Financeira e Vendas
export interface FinancialSummary {
  period: string;
  totalInferenceCostUsd: number;
  totalClientRevenueUsd: number;
  grossMarginUsd: number;
  marginPercentage: number;
  tokenConsumptionByModel: Record<string, { input: number; output: number; cost: number }>;
  recentInvoices: {
    invoiceId: string;
    clientName: string;
    amountUsd: number;
    tokensBilled: number;
    status: 'paid' | 'pending' | 'overdue';
    date: string;
  }[];
}

// Gestão de Usuários e RBAC
export type UserRole = 'admin' | 'architect' | 'operator' | 'auditor' | 'finance';

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
}
```

---

## 4. Plano Detalhado de Implementação e Verificação

1. **Camada de Provedores e Modelos**:
   - Construir o seletor multimodelos com catálogo nativo (Gemini 3.8/4-Argon, Claude 3.5 Sonnet, GPT-4o / Codex) com tabela de custos por 1M tokens.
2. **Canvas Visual de Nós (Drag-and-Drop)**:
   - Implementar tela interativa com nós conectáveis, formulário lateral de parâmetros, conectores de ferramentas e seletor de guardrails.
3. **Sandbox de Prévias, Avaliações (Evals) e Versionamento**:
   - Desenvolver visualizador de teste em tempo real, painel de criação e execução de baterias de testes com score automático e gerenciador de versões com snapshot e rollback.
4. **Painel Financeiro & Vendas**:
   - Dashboard com KPIs financeiros: custos operacionais de IA, preços de venda, margem de lucro, distribuição por modelo e faturas.
5. **Gerenciador de Contas e Usuários (RBAC)**:
   - Central de equipes com cadastro de membros, controle de limites mensais de gastos e alteração de privilégios.
6. **Interface de Voz, Temas e Exportação**:
   - Entrada e saída de áudio (STT + TTS), 4 opções de temas visuais (com Custom Studio) e exportação de relatórios em PDF e CSV estruturados.
