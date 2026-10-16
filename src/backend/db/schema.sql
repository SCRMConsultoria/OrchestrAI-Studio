-- OrchestrAI Studio PostgreSQL Schema
-- Strict adherence to TypeScript domain entities

CREATE TABLE IF NOT EXISTS models (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    description TEXT,
    input_cost_per_1m NUMERIC(10, 4) DEFAULT 0,
    output_cost_per_1m NUMERIC(10, 4) DEFAULT 0,
    context_window INT DEFAULT 128000,
    supports_tools BOOLEAN DEFAULT TRUE,
    supports_vision BOOLEAN DEFAULT FALSE,
    badge VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    avatar TEXT,
    description TEXT,
    model_id VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    system_instruction TEXT,
    temperature NUMERIC(3, 2) DEFAULT 0.7,
    top_p NUMERIC(3, 2) DEFAULT 0.95,
    top_k INT DEFAULT 40,
    tools JSONB DEFAULT '[]'::jsonb,
    guardrails JSONB DEFAULT '{}'::jsonb,
    voice_config JSONB DEFAULT '{}'::jsonb,
    current_version VARCHAR(50) DEFAULT 'v1.0.0',
    nodes JSONB DEFAULT '[]'::jsonb,
    edges JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    mode VARCHAR(50) DEFAULT 'sequential',
    agent_ids JSONB DEFAULT '[]'::jsonb,
    supervisor_agent_id VARCHAR(100),
    aggregation_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_runs (
    id VARCHAR(100) PRIMARY KEY,
    workflow_id VARCHAR(100),
    workflow_title VARCHAR(255) NOT NULL,
    user_query TEXT,
    mode VARCHAR(50) DEFAULT 'sequential',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE,
    total_duration_ms INT NOT NULL,
    total_cost_usd NUMERIC(10, 6) DEFAULT 0,
    total_tokens INT DEFAULT 0,
    logs JSONB DEFAULT '[]'::jsonb,
    final_output TEXT,
    status VARCHAR(50) NOT NULL,
    executed_by JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eval_cases (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    input_prompt TEXT NOT NULL,
    expected_keywords JSONB DEFAULT '[]'::jsonb,
    rubric_criteria JSONB DEFAULT '[]'::jsonb,
    max_latency_ms INT DEFAULT 5000,
    max_cost_usd NUMERIC(10, 6) DEFAULT 0.05,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_versions (
    version_id VARCHAR(100) PRIMARY KEY,
    agent_id VARCHAR(100) NOT NULL,
    version_number VARCHAR(50) NOT NULL,
    commit_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_email VARCHAR(255),
    nodes_snapshot JSONB NOT NULL,
    edges_snapshot JSONB NOT NULL,
    eval_score_avg NUMERIC(5, 2) DEFAULT 0,
    is_production BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    monthly_budget_cap_usd NUMERIC(10, 2) DEFAULT 100,
    current_month_spent_usd NUMERIC(10, 2) DEFAULT 0,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(100) PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    tokens_billed BIGINT DEFAULT 0,
    amount_usd NUMERIC(10, 2) NOT NULL,
    margin_profit_usd NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
