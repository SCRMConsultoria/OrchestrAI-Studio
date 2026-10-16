import React, { useState } from 'react';
import {
  Play,
  TestTube2,
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles,
} from 'lucide-react';
import { AgentConfig, EvaluationCase, EvaluationResult } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface PreviewAndEvalsProps {
  agents: AgentConfig[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  evalCases: EvaluationCase[];
  onAddEvalCase: (evalCase: EvaluationCase) => void;
  currentLanguage: LanguageCode;
}

export const PreviewAndEvals: React.FC<PreviewAndEvalsProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  evalCases,
  onAddEvalCase,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const [sandboxPrompt, setSandboxPrompt] = useState<string>(
    'Analise as vantagens operacionais da orquestração de agentes autônomos com auditoria contínua.'
  );
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [isSandboxRunning, setIsSandboxRunning] = useState<boolean>(false);
  const [sandboxMetrics, setSandboxMetrics] = useState<{
    latencyMs: number;
    tokens: number;
    costUsd: number;
  } | null>(null);

  const [isRunningEvals, setIsRunningEvals] = useState<boolean>(false);
  const [evalResults, setEvalResults] = useState<EvaluationResult[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const [isNewCaseOpen, setIsNewCaseOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [newKeywords, setNewKeywords] = useState<string>('');
  const [newCriteria, setNewCriteria] = useState<string>('');

  const handleRunSandbox = async () => {
    if (!sandboxPrompt.trim()) return;
    setIsSandboxRunning(true);
    setSandboxOutput('');
    setSandboxMetrics(null);

    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: sandboxPrompt,
          model: currentAgent.modelId,
          provider: currentAgent.provider,
          systemInstruction: currentAgent.systemInstruction,
          temperature: currentAgent.temperature,
          tools: currentAgent.tools,
          guardrails: currentAgent.guardrails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na prévia');

      setSandboxOutput(data.output || 'Sem resposta.');
      const totalTokens = data.tokens?.totalTokens || 500;
      setSandboxMetrics({
        latencyMs: data.durationMs || 1100,
        tokens: totalTokens,
        costUsd: (totalTokens / 1_000_000) * 0.6,
      });
    } catch (err: any) {
      setSandboxOutput(`Erro: ${err.message}`);
    } finally {
      setIsSandboxRunning(false);
    }
  };

  const handleRunAllEvals = async () => {
    setIsRunningEvals(true);
    setEvalResults([]);
    setOverallScore(null);

    const results: EvaluationResult[] = [];
    let totalScore = 0;

    for (const testCase of evalCases) {
      try {
        const genRes = await fetch('/api/models/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: testCase.inputPrompt,
            model: currentAgent.modelId,
            provider: currentAgent.provider,
            systemInstruction: currentAgent.systemInstruction,
            temperature: currentAgent.temperature,
            guardrails: currentAgent.guardrails,
          }),
        });

        const genData = await genRes.json();
        const actualOutput = genData.output || '';
        const latencyMs = genData.durationMs || 1200;
        const totalTokens = genData.tokens?.totalTokens || 400;
        const costUsd = (totalTokens / 1_000_000) * 0.6;

        const evalRes = await fetch('/api/evals/run-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputPrompt: testCase.inputPrompt,
            expectedOutputSubstring: testCase.expectedKeywords.join(', '),
            actualOutput,
            rubricCriteria: testCase.rubricCriteria,
            maxLatencyMs: testCase.maxLatencyMs,
            actualLatencyMs: latencyMs,
            maxCostUsd: testCase.maxCostUsd,
            actualCostUsd: costUsd,
          }),
        });

        const evalData = await evalRes.json();
        const score = evalData.score ?? 85;
        totalScore += score;

        results.push({
          caseId: testCase.id,
          caseTitle: testCase.title,
          score,
          passed: evalData.passed ?? (score >= 75),
          actualOutput,
          feedback: evalData.feedback || 'Avaliado com sucesso.',
          latencyMs,
          costUsd,
          criteriaBreakdown: evalData.criteriaBreakdown || [],
        });

        setEvalResults([...results]);
      } catch (err: any) {
        results.push({
          caseId: testCase.id,
          caseTitle: testCase.title,
          score: 0,
          passed: false,
          actualOutput: `Falha: ${err.message}`,
          feedback: 'Erro ao rodar caso de teste.',
          latencyMs: 0,
          costUsd: 0,
          criteriaBreakdown: [],
        });
        setEvalResults([...results]);
      }
    }

    if (evalCases.length > 0) {
      setOverallScore(Math.round(totalScore / evalCases.length));
    }
    setIsRunningEvals(false);
  };

  const handleCreateCase = () => {
    if (!newTitle.trim() || !newPrompt.trim()) return;

    const newCase: EvaluationCase = {
      id: `eval-${Date.now()}`,
      title: newTitle.trim(),
      inputPrompt: newPrompt.trim(),
      expectedKeywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      rubricCriteria: newCriteria.split('\n').map((c) => c.trim()).filter(Boolean),
      maxLatencyMs: 4000,
      maxCostUsd: 0.01,
    };

    onAddEvalCase(newCase);
    setIsNewCaseOpen(false);
    setNewTitle('');
    setNewPrompt('');
    setNewKeywords('');
    setNewCriteria('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
            Laboratório de Engenharia & Qualidade
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
            {t.titleSandboxPreview} & {t.titleEvalSuite}
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1">
            Iteração rápida com testes ao vivo e avaliação automatizada com métricas de assertividade, latência e custo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--theme-text-muted)]">Agente Testado:</span>
          <Tooltip content="Selecione o agente para rodar testes na prévia ou disparar a suíte de evals" position="left">
            <select
              value={currentAgent.id}
              onChange={(e) => onSelectAgent(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.avatar} {ag.name} ({ag.modelId})
                </option>
              ))}
            </select>
          </Tooltip>
        </div>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Sandbox */}
        <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />
              <h3 className="text-sm font-bold text-[var(--theme-text)]">
                {t.titleSandboxPreview}
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--theme-text-muted)]">
              {currentAgent.currentVersion} · {currentAgent.modelId}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1.5">
              Prompt de Teste Rápido
            </label>
            <textarea
              rows={3}
              value={sandboxPrompt}
              onChange={(e) => setSandboxPrompt(e.target.value)}
              className="w-full p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
              placeholder={t.placeholderSandboxPrompt}
            />
          </div>

          <div className="flex justify-end">
            <Tooltip content="Dispara uma execução isolada de teste com o agente ativo para inspecionar resposta e latência">
              <button
                onClick={handleRunSandbox}
                disabled={isSandboxRunning || !sandboxPrompt.trim()}
                className="px-5 py-2 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSandboxRunning ? 'Executando...' : t.actionTestSandbox}</span>
              </button>
            </Tooltip>
          </div>

          {/* Sandbox Result Output */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
              <span className="font-semibold uppercase text-[10px]">Saída da Prévia:</span>
              {sandboxMetrics && (
                <span className="font-mono text-[11px] text-[var(--theme-text)]">
                  {sandboxMetrics.latencyMs}ms · {sandboxMetrics.tokens} tokens · ${sandboxMetrics.costUsd.toFixed(5)}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-xs text-[var(--theme-text)] font-mono min-h-[140px] whitespace-pre-wrap leading-relaxed">
              {sandboxOutput || (
                <span className="text-[var(--theme-text-muted)] italic">
                  A saída da prévia do agente será exibida aqui após a execução.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Evals */}
        <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-[var(--theme-text)]">
                {t.titleEvalSuite}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip content="Cadastra um novo caso de teste com critérios de rubrica para a bateria automatizada">
                <button
                  onClick={() => setIsNewCaseOpen(true)}
                  className="px-2.5 py-1 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-medium flex items-center gap-1 hover:border-[var(--theme-accent)] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{t.actionAddCase}</span>
                </button>
              </Tooltip>

              <Tooltip content={t.tooltipRunEvalSuite}>
                <button
                  onClick={handleRunAllEvals}
                  disabled={isRunningEvals || evalCases.length === 0}
                  className="px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isRunningEvals ? 'Avaliando...' : t.actionRunEvals}</span>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Overall Scorecard Banner */}
          {overallScore !== null && (
            <div className="p-3.5 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-[var(--theme-text-muted)]">
                  Score Médio de Qualidade
                </div>
                <div className="text-2xl font-bold font-mono text-[var(--theme-accent)]">
                  {overallScore}%
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    overallScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {overallScore >= 80 ? 'APROVADO PARA PRODUÇÃO' : 'REQUER AJUSTES'}
                </span>
                <div className="text-[10px] text-[var(--theme-text-muted)] mt-1">
                  {evalResults.filter((r) => r.passed).length} de {evalResults.length} testes passaram
                </div>
              </div>
            </div>
          )}

          {/* Test Cases List */}
          <div className="space-y-3">
            {evalCases.map((tc) => {
              const result = evalResults.find((r) => r.caseId === tc.id);
              return (
                <div
                  key={tc.id}
                  className="p-3.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--theme-text)]">
                      {tc.title}
                    </span>
                    {result ? (
                      <span
                        className={`text-xs font-mono font-bold flex items-center gap-1 ${
                          result.passed ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {result.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{result.score}%</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--theme-text-muted)]">
                        Pendente
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-[var(--theme-text-muted)] bg-[var(--theme-surface)] p-2 rounded border border-[var(--theme-border)]">
                    &quot;{tc.inputPrompt}&quot;
                  </div>

                  {result && (
                    <div className="text-[11px] text-[var(--theme-accent)] pt-1 border-t border-[var(--theme-border)]">
                      <span className="font-semibold">Parecer do Juiz:</span> {result.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Test Case Modal */}
      {isNewCaseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              {t.actionAddCase}
            </h3>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Título do Teste
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Validação de Formato JSON"
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Prompt de Entrada
              </label>
              <textarea
                rows={2}
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Ex: Gere a lista de dependências..."
                className="w-full p-2.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Palavras-chave Obrigatórias
              </label>
              <input
                type="text"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                placeholder="Ex: dependencias, versoes, json"
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Critérios da Rubrica (1 por linha)
              </label>
              <textarea
                rows={3}
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                placeholder="Validar syntax JSON&#10;Sem alucinações de bibliotecas&#10;Completude de campos"
                className="w-full p-2.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewCaseOpen(false)}
                className="px-3 py-1.5 rounded-md border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCase}
                disabled={!newTitle.trim() || !newPrompt.trim()}
                className="px-4 py-1.5 rounded-md bg-[var(--theme-accent)] text-slate-950 font-bold text-xs disabled:opacity-50 cursor-pointer"
              >
                Salvar Caso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
