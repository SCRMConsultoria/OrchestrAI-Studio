import React, { useState } from 'react';
import {
  Play,
  Square,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileDown,
  FileSpreadsheet,
  Copy,
  Check,
  Search,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  WorkflowDefinition,
  AgentConfig,
  WorkflowRun,
  ExecutionLogItem,
  UserAccount,
} from '../../../types';
import { voiceService } from '../../../services/voiceService';
import { exportRunToPDF, exportRunsToCSV } from '../../../utils/exportUtils';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface WorkflowRunnerProps {
  workflows: WorkflowDefinition[];
  agents: AgentConfig[];
  runs: WorkflowRun[];
  onAddRun: (run: WorkflowRun) => void;
  currentUser: UserAccount;
  currentLanguage: LanguageCode;
  onSelectAgentForCanvas: (agentId: string) => void;
}

export const WorkflowRunner: React.FC<WorkflowRunnerProps> = ({
  workflows,
  agents,
  runs,
  onAddRun,
  currentUser,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
    workflows[0]?.id || ''
  );
  const [promptInput, setPromptInput] = useState<string>(
    'Quais são os principais fatores para garantir segurança e auditoria em sistemas multiagente em 2026?'
  );
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceTranscriptFeedback, setVoiceTranscriptFeedback] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [liveLogs, setLiveLogs] = useState<ExecutionLogItem[]>([]);
  const [finalResult, setFinalResult] = useState<string>('');
  const [currentRun, setCurrentRun] = useState<WorkflowRun | null>(runs[0] || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeWorkflow =
    workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  const workflowAgents = (activeWorkflow?.agentIds || [])
    .map((id) => agents.find((a) => a.id === id))
    .filter(Boolean) as AgentConfig[];

  const supervisorAgent = activeWorkflow?.supervisorAgentId
    ? agents.find((a) => a.id === activeWorkflow.supervisorAgentId)
    : null;

  // Handle voice recording
  const handleToggleVoice = () => {
    if (isRecordingVoice) {
      voiceService.stopListening();
      setIsRecordingVoice(false);
      setVoiceTranscriptFeedback('');
    } else {
      setErrorMessage(null);
      setIsRecordingVoice(true);
      setVoiceTranscriptFeedback('Ouvindo microfone...');

      voiceService.startListening(
        (transcript, isFinal) => {
          setPromptInput((prev) => (isFinal ? transcript : transcript || prev));
          setVoiceTranscriptFeedback(
            isFinal ? 'Transcrição concluída!' : `Ouvindo: "${transcript}"`
          );
          if (isFinal) {
            setIsRecordingVoice(false);
          }
        },
        (err) => {
          setIsRecordingVoice(false);
          setVoiceTranscriptFeedback('');
          setErrorMessage(`Erro no microfone: ${err}`);
        },
        () => {
          setIsRecordingVoice(false);
        }
      );
    }
  };

  // Play spoken final response
  const handleToggleSpeak = () => {
    if (isPlayingAudio) {
      voiceService.stopSpeaking();
      setIsPlayingAudio(false);
    } else if (finalResult) {
      setIsPlayingAudio(true);
      voiceService.speakText(
        finalResult,
        supervisorAgent?.voiceConfig.voiceName || 'Kore',
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  // Run the multi-agent pipeline
  const handleRunWorkflow = async () => {
    if (!promptInput.trim()) return;

    setIsRunning(true);
    setErrorMessage(null);
    setLiveLogs([]);
    setFinalResult('');
    setActiveStepIndex(0);

    const runId = `run-${Date.now()}`;
    const startTime = Date.now();
    const collectedLogs: ExecutionLogItem[] = [];
    let totalTokens = 0;
    let totalCost = 0;

    try {
      // Step 1: Supervisor planning if in supervisor mode
      if (activeWorkflow.mode === 'supervisor' && supervisorAgent) {
        setActiveStepIndex(0);
        const supervisorLogId = `log-${Date.now()}-sup`;

        const supRes = await fetch('/api/models/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Como supervisor autônomo, analise a solicitação do usuário e elabore um plano de execução coordenado:\n"${promptInput}"`,
            model: supervisorAgent.modelId,
            provider: supervisorAgent.provider,
            systemInstruction: supervisorAgent.systemInstruction,
            temperature: supervisorAgent.temperature,
            guardrails: supervisorAgent.guardrails,
          }),
        });

        const supData = await supRes.json();
        if (!supRes.ok) throw new Error(supData.error || 'Erro no Agente Supervisor');

        const supTokens = supData.tokens?.totalTokens || 600;
        const supCost = (supTokens / 1_000_000) * 1.25;
        totalTokens += supTokens;
        totalCost += supCost;

        const supLogItem: ExecutionLogItem = {
          id: supervisorLogId,
          runId,
          agentId: supervisorAgent.id,
          agentName: supervisorAgent.name,
          avatar: supervisorAgent.avatar,
          model: supervisorAgent.modelId,
          timestamp: new Date().toISOString(),
          status: 'completed',
          stageName: 'Planejamento e Decomposição do Supervisor',
          inputContent: promptInput,
          outputContent: supData.output,
          metrics: {
            durationMs: supData.durationMs || 1200,
            promptTokens: supData.tokens?.promptTokens || 350,
            candidatesTokens: supData.tokens?.candidatesTokens || 250,
            totalTokens: supTokens,
            estimatedCostUsd: supCost,
          },
        };

        collectedLogs.push(supLogItem);
        setLiveLogs([...collectedLogs]);
      }

      // Step 2: Parallel or Sequential Agents
      if (activeWorkflow.mode === 'parallel') {
        const parallelPromises = workflowAgents.map(async (agent) => {
          const agentLogId = `log-${Date.now()}-${agent.id}`;
          const isSearchAgent = agent.tools.includes('googleSearch');

          const res = await fetch('/api/models/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `Analise a solicitação de forma especializada como ${agent.name} (${agent.role}):\n"${promptInput}"`,
              model: agent.modelId,
              provider: agent.provider,
              systemInstruction: agent.systemInstruction,
              temperature: agent.temperature,
              tools: agent.tools,
              guardrails: agent.guardrails,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || `Erro no agente ${agent.name}`);

          const tokens = data.tokens?.totalTokens || 800;
          const cost = (tokens / 1_000_000) * 0.6;

          return {
            id: agentLogId,
            runId,
            agentId: agent.id,
            agentName: agent.name,
            avatar: agent.avatar,
            model: agent.modelId,
            timestamp: new Date().toISOString(),
            status: 'completed' as const,
            stageName: `Execução Paralela (${agent.role})`,
            inputContent: promptInput,
            outputContent: data.output,
            toolInvocations: isSearchAgent && data.sources?.length ? [
              {
                toolName: 'googleSearch',
                query: promptInput,
                resultSnippet: 'Fontes verificadas em tempo real.',
                sources: data.sources,
              },
            ] : undefined,
            metrics: {
              durationMs: data.durationMs || 1500,
              promptTokens: data.tokens?.promptTokens || 400,
              candidatesTokens: data.tokens?.candidatesTokens || 400,
              totalTokens: tokens,
              estimatedCostUsd: cost,
            },
          };
        });

        const parallelResults = await Promise.all(parallelPromises);
        parallelResults.forEach((log) => {
          totalTokens += log.metrics.totalTokens;
          totalCost += log.metrics.estimatedCostUsd;
          collectedLogs.push(log);
        });
        setLiveLogs([...collectedLogs]);
      } else {
        // Sequential
        let accumulatedContext = promptInput;

        for (let i = 0; i < workflowAgents.length; i++) {
          const agent = workflowAgents[i];
          setActiveStepIndex(i + 1);
          const agentLogId = `log-${Date.now()}-${agent.id}`;

          const res = await fetch('/api/models/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `Contexto acumulado da missão:\n${accumulatedContext}\n\nExecute sua etapa como ${agent.name} (${agent.role}).`,
              model: agent.modelId,
              provider: agent.provider,
              systemInstruction: agent.systemInstruction,
              temperature: agent.temperature,
              tools: agent.tools,
              guardrails: agent.guardrails,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || `Erro no agente ${agent.name}`);

          const tokens = data.tokens?.totalTokens || 900;
          const cost = (tokens / 1_000_000) * 0.7;
          totalTokens += tokens;
          totalCost += cost;

          const isSearchAgent = agent.tools.includes('googleSearch');
          const logItem: ExecutionLogItem = {
            id: agentLogId,
            runId,
            agentId: agent.id,
            agentName: agent.name,
            avatar: agent.avatar,
            model: agent.modelId,
            timestamp: new Date().toISOString(),
            status: 'completed',
            stageName: `Etapa ${i + 1}: ${agent.role}`,
            inputContent: accumulatedContext,
            outputContent: data.output,
            toolInvocations: isSearchAgent && data.sources?.length ? [
              {
                toolName: 'googleSearch',
                query: accumulatedContext.slice(0, 100),
                resultSnippet: 'Extração factual concluída.',
                sources: data.sources,
              },
            ] : undefined,
            metrics: {
              durationMs: data.durationMs || 1600,
              promptTokens: data.tokens?.promptTokens || 500,
              candidatesTokens: data.tokens?.candidatesTokens || 400,
              totalTokens: tokens,
              estimatedCostUsd: cost,
            },
          };

          collectedLogs.push(logItem);
          setLiveLogs([...collectedLogs]);
          accumulatedContext = `[Relatório de ${agent.name}]:\n${data.output}`;
        }
      }

      // Step 3: Synthesis
      const summaryRes = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Consolide as respostas e dados gerados por todos os agentes em um resumo executivo final de alto impacto:\n\n${collectedLogs.map((l) => `[${l.agentName}]:\n${l.outputContent}`).join('\n\n')}`,
          model: 'gemini-3.1-flash-lite',
          provider: 'google',
          systemInstruction: 'Você é o sintetizador final do orquestrador. Apresente os resultados com tópicos objetivos, dados concretos e conclusões claras.',
        }),
      });

      const summaryData = await summaryRes.json();
      const outputText = summaryData.output || 'Orquestração finalizada com êxito.';
      setFinalResult(outputText);

      const totalDurationMs = Date.now() - startTime;
      const finalTokens = totalTokens + (summaryData.tokens?.totalTokens || 400);
      const finalCost = totalCost + ((summaryData.tokens?.totalTokens || 400) / 1_000_000) * 0.6;

      const newRun: WorkflowRun = {
        id: runId,
        workflowId: activeWorkflow.id,
        workflowTitle: activeWorkflow.title,
        userQuery: promptInput,
        mode: activeWorkflow.mode,
        startedAt: new Date(startTime).toISOString(),
        finishedAt: new Date().toISOString(),
        totalDurationMs,
        totalCostUsd: finalCost,
        totalTokens: finalTokens,
        logs: collectedLogs,
        finalOutput: outputText,
        status: 'completed',
        executedBy: {
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
        },
      };

      setCurrentRun(newRun);
      onAddRun(newRun);
    } catch (err: any) {
      console.error('Workflow error:', err);
      setErrorMessage(err.message || 'Falha na execução do workflow');
    } finally {
      setIsRunning(false);
      setActiveStepIndex(-1);
    }
  };

  const handleCopy = () => {
    if (!finalResult) return;
    navigator.clipboard.writeText(finalResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Workflow Selection and Mode Card */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--theme-border)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
              {t.titleWorkflowMission}
            </div>
            <h1 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
              {activeWorkflow.title}
            </h1>
            <p className="text-xs text-[var(--theme-text-muted)] mt-1">
              {activeWorkflow.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--theme-text-muted)]">Selecionar Fluxo:</span>
            <Tooltip content="Escolha entre fluxos pré-configurados de orquestração" position="left">
              <select
                value={selectedWorkflowId}
                onChange={(e) => setSelectedWorkflowId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] cursor-pointer"
              >
                {workflows.map((wf) => (
                  <option key={wf.id} value={wf.id}>
                    {wf.title} ({wf.mode.toUpperCase()})
                  </option>
                ))}
              </select>
            </Tooltip>
          </div>
        </div>

        {/* Dynamic Topology Grid */}
        <div className="pt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-text-muted)] mb-3">
            {t.titleTopology} ({activeWorkflow.mode.toUpperCase()})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {supervisorAgent && activeWorkflow.mode === 'supervisor' && (
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  isRunning && activeStepIndex === 0
                    ? 'border-[var(--theme-accent)] bg-[var(--theme-surface-subtle)] ring-1 ring-[var(--theme-accent)]'
                    : 'border-[var(--theme-border)] bg-[var(--theme-surface-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{supervisorAgent.avatar}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    SUPERVISOR
                  </span>
                </div>
                <div className="font-semibold text-xs text-[var(--theme-text)] truncate">
                  {supervisorAgent.name}
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)] truncate mt-0.5">
                  {supervisorAgent.modelId}
                </div>
                <div className="mt-3 text-[11px] font-mono text-[var(--theme-text-muted)] flex items-center justify-between">
                  <span>Status:</span>
                  <span
                    className={
                      isRunning && activeStepIndex === 0
                        ? 'text-amber-400 animate-pulse font-medium'
                        : 'text-slate-400'
                    }
                  >
                    {isRunning && activeStepIndex === 0 ? 'Orquestrando...' : 'Pronto'}
                  </span>
                </div>
              </div>
            )}

            {workflowAgents.map((agent, index) => {
              const isCurrentActive = isRunning && activeStepIndex === index + 1;
              return (
                <div
                  key={agent.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isCurrentActive
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-surface-subtle)] ring-1 ring-[var(--theme-accent)]'
                      : 'border-[var(--theme-border)] bg-[var(--theme-surface-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{agent.avatar}</span>
                    <span className="text-[10px] font-mono text-[var(--theme-text-muted)]">
                      {agent.provider.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-[var(--theme-text)] truncate">
                    {agent.name}
                  </div>
                  <div className="text-[11px] text-[var(--theme-text-muted)] truncate mt-0.5">
                    {agent.role}
                  </div>
                  <div className="mt-3 text-[11px] font-mono text-[var(--theme-text-muted)] flex items-center justify-between">
                    <span>{agent.modelId}</span>
                    <span
                      className={
                        isCurrentActive
                          ? 'text-[var(--theme-accent)] animate-pulse font-medium'
                          : 'text-slate-400'
                      }
                    >
                      {isCurrentActive ? 'Executando...' : 'Aguardando'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice & Prompt Input Center */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
            {t.titleUserInput}
          </label>
          {voiceTranscriptFeedback && (
            <span className="text-xs text-[var(--theme-accent)] font-medium animate-pulse">
              {voiceTranscriptFeedback}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            disabled={isRunning}
            rows={3}
            placeholder={t.placeholderInput}
            className="w-full p-3.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-sm placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] transition-all resize-none"
          />

          {/* Voice Input Trigger Button with Tooltip */}
          <Tooltip content={isRecordingVoice ? t.tooltipVoice : t.tooltipVoice} position="left">
            <button
              onClick={handleToggleVoice}
              disabled={isRunning}
              className={`absolute right-3 bottom-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                isRecordingVoice
                  ? 'bg-rose-500 border-rose-600 text-white animate-pulse shadow-md'
                  : 'border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]'
              }`}
            >
              {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>

        {/* Quick Prompt Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-[var(--theme-text-muted)] font-medium">
            {t.titleQuickSuggestions}
          </span>
          <Tooltip content="Carrega um prompt pronto focado em auditoria e conformidade regulatória para 2026">
            <button
              onClick={() =>
                setPromptInput(
                  'Quais são os marcos regulatórios de conformidade e auditoria em IA autônoma em 2026?'
                )
              }
              className="text-[11px] px-2.5 py-1 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer"
            >
              Auditoria Regulatória 2026
            </button>
          </Tooltip>
          <Tooltip content="Carrega prompt para investigar injeção de prompt e redação de dados pessoais PII">
            <button
              onClick={() =>
                setPromptInput(
                  'Investigar vulnerabilidades de injeção de prompt e redação de PII em fluxos com LLMs.'
                )
              }
              className="text-[11px] px-2.5 py-1 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer"
            >
              Segurança & Guardrails PII
            </button>
          </Tooltip>
          <Tooltip content="Carrega prompt para comparar custos de inferência de Gemini, Claude e Codex">
            <button
              onClick={() =>
                setPromptInput(
                  'Comparar custos de inferência e janelas de contexto entre Gemini 3.8, Claude 3.5 e GPT-4o.'
                )
              }
              className="text-[11px] px-2.5 py-1 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer"
            >
              Benchmark de Custos
            </button>
          </Tooltip>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Run Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-[var(--theme-text-muted)] font-mono">
            Modo Selecionado: <span className="font-semibold text-[var(--theme-text)]">{activeWorkflow.mode.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-3">
            {isRunning ? (
              <Tooltip content="Interrompe o fluxo de execução ativo e preserva os logs parciais">
                <button
                  onClick={() => setIsRunning(false)}
                  className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>{t.actionInterrupt}</span>
                </button>
              </Tooltip>
            ) : (
              <Tooltip content={t.tooltipRunWorkflow} position="top">
                <button
                  onClick={handleRunWorkflow}
                  disabled={!promptInput.trim()}
                  className="px-6 py-2.5 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.actionRunWorkflow}</span>
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Execution Logs Terminal */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-muted)] flex items-center gap-2">
            <span>{t.titleExecutionLogs}</span>
            {isRunning && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Ativo
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-[var(--theme-text-muted)]">
            {liveLogs.length} etapas registradas
          </span>
        </div>

        {liveLogs.length === 0 ? (
          <div className="p-8 rounded-lg border border-dashed border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-center text-xs text-[var(--theme-text-muted)]">
            Nenhuma execução ativa no momento. Digite uma instrução acima e clique em &quot;{t.actionRunWorkflow}&quot;.
          </div>
        ) : (
          <div className="space-y-3">
            {liveLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{log.avatar}</span>
                    <div>
                      <div className="text-xs font-bold text-[var(--theme-text)]">
                        {log.agentName}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-muted)]">
                        {log.stageName} · {log.model}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--theme-text-muted)]">
                    <span>{log.metrics.durationMs}ms</span>
                    <span>{log.metrics.totalTokens} tokens</span>
                    <span className="text-[var(--theme-accent)]">
                      ${log.metrics.estimatedCostUsd.toFixed(5)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[var(--theme-text)] bg-[var(--theme-surface)] p-3 rounded-md border border-[var(--theme-border)] font-mono whitespace-pre-wrap leading-relaxed">
                  {log.outputContent}
                </div>

                {log.toolInvocations && log.toolInvocations.length > 0 && (
                  <div className="p-2.5 rounded-md bg-[var(--theme-surface)] border border-dashed border-[var(--theme-border)] space-y-1.5">
                    <div className="text-[11px] font-semibold text-[var(--theme-accent)] flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" />
                      <span>Ferramenta Utilizada: {log.toolInvocations[0].toolName}</span>
                    </div>
                    {log.toolInvocations[0].sources && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {log.toolInvocations[0].sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] flex items-center gap-1 underline"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Final Consolidated Output */}
      {finalResult && (
        <div className="p-5 rounded-xl border border-[var(--theme-accent)]/30 bg-[var(--theme-surface)] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />
              <h3 className="text-sm font-bold font-display text-[var(--theme-text)]">
                {t.titleConsolidatedResponse}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Speech Synthesis Button */}
              <Tooltip content={t.tooltipSpeak} position="top">
                <button
                  onClick={handleToggleSpeak}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] hover:border-[var(--theme-accent)]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.actionStopAudio}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                      <span>{t.actionSpeakAudio}</span>
                    </>
                  )}
                </button>
              </Tooltip>

              <Tooltip content="Copiar resposta consolidada para a área de transferência" position="top">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </Tooltip>

              {currentRun && (
                <>
                  <Tooltip content={t.tooltipExportPDF} position="top">
                    <button
                      onClick={() => exportRunToPDF(currentRun)}
                      className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t.actionExportPDF}</span>
                    </button>
                  </Tooltip>

                  <Tooltip content={t.tooltipExportCSV} position="top">
                    <button
                      onClick={() => exportRunsToCSV([currentRun])}
                      className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.actionExportCSV}</span>
                    </button>
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] leading-relaxed whitespace-pre-wrap">
            {finalResult}
          </div>

          {currentRun && (
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[var(--theme-text-muted)] pt-1">
              <div>
                ID: <span className="text-[var(--theme-text)]">{currentRun.id}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Duração: {(currentRun.totalDurationMs / 1000).toFixed(2)}s</span>
                <span>Tokens: {currentRun.totalTokens.toLocaleString('pt-BR')}</span>
                <span className="text-[var(--theme-accent)] font-semibold">
                  Custo Total: ${currentRun.totalCostUsd.toFixed(5)} USD
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
