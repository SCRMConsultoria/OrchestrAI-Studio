import React, { useState } from 'react';
import {
  GitBranch,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AgentConfig, AgentVersion } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface VersionControlPanelProps {
  agents: AgentConfig[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  versions: AgentVersion[];
  onRollbackToVersion: (agentId: string, versionId: string) => void;
  currentLanguage: LanguageCode;
}

export const VersionControlPanel: React.FC<VersionControlPanelProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  versions,
  onRollbackToVersion,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const agentVersions = versions.filter((v) => v.agentId === currentAgent.id);

  const [compareVersionAId, setCompareVersionAId] = useState<string>(
    agentVersions[0]?.versionId || ''
  );
  const [compareVersionBId, setCompareVersionBId] = useState<string>(
    agentVersions[1]?.versionId || agentVersions[0]?.versionId || ''
  );
  const [rollbackSuccessMsg, setRollbackSuccessMsg] = useState<string | null>(null);

  const verA = agentVersions.find((v) => v.versionId === compareVersionAId);
  const verB = agentVersions.find((v) => v.versionId === compareVersionBId);

  const handleRollback = (vId: string) => {
    onRollbackToVersion(currentAgent.id, vId);
    setRollbackSuccessMsg(`Agente revertido com sucesso para a versão!`);
    setTimeout(() => setRollbackSuccessMsg(null), 3500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
            Ciclo de Vida & Governança
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
            {t.titleVersionTimeline} & Rollback
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1">
            Histórico cronológico imutável com rastreabilidade de commits, comparador de diffs e restauração em 1 clique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--theme-text-muted)]">Agente:</span>
          <Tooltip content="Selecione o agente para inspecionar histórico de releases e diffs" position="left">
            <select
              value={currentAgent.id}
              onChange={(e) => onSelectAgent(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.avatar} {ag.name} ({ag.currentVersion})
                </option>
              ))}
            </select>
          </Tooltip>
        </div>
      </div>

      {rollbackSuccessMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{rollbackSuccessMsg}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Column (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[var(--theme-accent)]" />
              <h3 className="text-sm font-bold text-[var(--theme-text)]">
                {t.titleVersionTimeline} ({agentVersions.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--theme-text-muted)]">
              Produção: <strong className="text-emerald-400">{currentAgent.currentVersion}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {agentVersions.map((ver) => (
              <div
                key={ver.versionId}
                className={`p-4 rounded-lg border transition-all ${
                  ver.isProduction
                    ? 'border-emerald-500/40 bg-[var(--theme-surface-subtle)] ring-1 ring-emerald-500/30'
                    : 'border-[var(--theme-border)] bg-[var(--theme-surface-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)]">
                      {ver.versionNumber}
                    </span>
                    {ver.isProduction && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> EM PRODUÇÃO
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-[var(--theme-accent)]">
                      Eval Score: {ver.evalScoreAvg}%
                    </span>
                  </div>

                  {!ver.isProduction && (
                    <Tooltip content={t.tooltipRollback} position="left">
                      <button
                        onClick={() => handleRollback(ver.versionId)}
                        className="px-2.5 py-1 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-amber-400 hover:text-amber-300 text-xs text-[var(--theme-text-muted)] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t.actionRollback}</span>
                      </button>
                    </Tooltip>
                  )}
                </div>

                <div className="text-xs text-[var(--theme-text)] font-medium">
                  {ver.commitMessage}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--theme-text-muted)] font-mono pt-2 border-t border-[var(--theme-border)]/50 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(ver.createdAt).toLocaleString('pt-BR')}
                  </span>
                  <span>{ver.authorEmail}</span>
                  <span className="text-[var(--theme-text)]">
                    {ver.nodesSnapshot.length} nós · {ver.edgesSnapshot.length} conexões
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diff Inspector Column (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--theme-accent)]" />
              <h3 className="text-sm font-bold text-[var(--theme-text)]">
                {t.titleDiffComparator}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-[var(--theme-text-muted)] uppercase block mb-1">
                Versão Base (A)
              </label>
              <select
                value={compareVersionAId}
                onChange={(e) => setCompareVersionAId(e.target.value)}
                className="w-full p-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] font-mono text-xs cursor-pointer"
              >
                {agentVersions.map((v) => (
                  <option key={v.versionId} value={v.versionId}>
                    {v.versionNumber} ({v.commitMessage.slice(0, 18)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[var(--theme-text-muted)] uppercase block mb-1">
                Versão Alvo (B)
              </label>
              <select
                value={compareVersionBId}
                onChange={(e) => setCompareVersionBId(e.target.value)}
                className="w-full p-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] font-mono text-xs cursor-pointer"
              >
                {agentVersions.map((v) => (
                  <option key={v.versionId} value={v.versionId}>
                    {v.versionNumber} ({v.commitMessage.slice(0, 18)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {verA && verB && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] space-y-2">
                <div className="font-semibold text-[var(--theme-text)] flex items-center justify-between">
                  <span>Delta de Nós da Lógica</span>
                  <span className="font-mono text-[var(--theme-accent)]">
                    {verA.nodesSnapshot.length} nós <ArrowRight className="w-3 h-3 inline" />{' '}
                    {verB.nodesSnapshot.length} nós
                  </span>
                </div>
                <div className="font-semibold text-[var(--theme-text)] flex items-center justify-between">
                  <span>Delta de Conexões</span>
                  <span className="font-mono text-[var(--theme-accent)]">
                    {verA.edgesSnapshot.length} fios <ArrowRight className="w-3 h-3 inline" />{' '}
                    {verB.edgesSnapshot.length} fios
                  </span>
                </div>
                <div className="font-semibold text-[var(--theme-text)] flex items-center justify-between">
                  <span>Variação de Score Eval</span>
                  <span
                    className={`font-mono font-bold ${
                      verB.evalScoreAvg >= verA.evalScoreAvg
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {verB.evalScoreAvg - verA.evalScoreAvg >= 0 ? '+' : ''}
                    {verB.evalScoreAvg - verA.evalScoreAvg}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] space-y-1.5">
                <div className="text-[11px] font-semibold text-[var(--theme-text-muted)] uppercase">
                  Nós Presentes na Versão B ({verB.versionNumber}):
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {verB.nodesSnapshot.map((n, i) => (
                    <div key={i} className="text-[var(--theme-text)] flex items-center gap-1.5">
                      <span className="text-emerald-400">+</span>
                      <span>{n.title}</span>
                      <span className="text-[var(--theme-text-muted)]">({n.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
