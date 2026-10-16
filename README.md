# OrchestrAI Studio

> Plataforma Full-Stack Corporativa de Orquestração, Engenharia Visual de Agentes e Governança de IA.

## 🚀 Visão Geral
O **OrchestrAI Studio** é um ecossistema modular para:
- Orquestração de fluxos multiagente (Sequencial, Paralelo e Supervisor)
- Interface com comando por voz (STT) e síntese auditiva (TTS)
- Construtor visual de nós com drag-and-drop
- Suporte a múltiplos provedores de modelos (Gemini, Claude, GPT/Codex)
- Bateria de avaliações em linha (Evals com juiz LLM)
- Controle de versão de agentes com diff visual e rollback
- Painel financeiro de faturamento, margem e custos de tokens
- Gestão de contas e papéis de acesso (RBAC) com cotas de orçamento
- Trilha de auditoria e exportação de relatórios em PDF e CSV
- Integração preparada para PostgreSQL (Cloud SQL) e Dockerfile de produção

## 🛠️ Tecnologias
- **Frontend**: Vite, React 19 + TypeScript, Tailwind CSS, Arquitetura por Signals (reatividade fina estilo Angular), Internacionalização (PT, EN, FR, RU, ZH, DE).
- **Backend**: Node.js, Express, TypeScript, @google/genai SDK.
- **Banco de Dados**: PostgreSQL com Drizzle ORM.
- **Containerização**: Docker (Node 22 Alpine, multi-stage build).

## 📦 Estrutura de Branches
- `main`: Branch de produção limpa e estável.
- `stage`: Ambiente de homologação / staging espelhado da main.
- `develop`: Branch de integração de desenvolvimento.
- `feature/*`: Branches de funcionalidades (ex: `feature/202610/criacao-projeto`).
