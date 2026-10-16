import React, { useState } from 'react';
import {
  FileDown,
  FileSpreadsheet,
  Search,
  Filter,
  CloudCheck,
  Eye,
} from 'lucide-react';
import { WorkflowRun, ExecutionLogItem } from '../../../types';
import { exportRunToPDF, exportRunsToCSV, exportAuditLogsToCSV } from '../../../utils/exportUtils';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface AuditAndReportsPanelProps {
  runs: WorkflowRun[];
  currentLanguage: LanguageCode;
}

export const AuditAndReportsPanel: React.FC<AuditAndReportsPanelProps> = ({ runs, currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRunForModal, setSelectedRunForModal] = useState<WorkflowRun | null>(null);

  const allLogs: ExecutionLogItem[] = runs.flatMap((r) => r.logs);

  const filteredRuns = runs.filter((r) => {
    const matchSearch =
      r.workflowTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userQuery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.executedBy.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
            Conformidade, Trilha de Auditoria & Nuvem
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
            {t.titleAuditHistory}
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1">
            Logs criptográficos imutáveis de todas as execuções, chamadas de ferramentas e exportação para PDF e CSV.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content={t.tooltipExportCSV} position="bottom">
            <button
              onClick={() => exportRunsToCSV(runs)}
              className="px-3.5 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{t.actionExportCSV}</span>
            </button>
          </Tooltip>

          {runs[0] && (
            <Tooltip content={t.tooltipExportPDF} position="bottom">
              <button
                onClick={() => exportRunToPDF(runs[0])}
                className="px-4 py-2 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{t.actionExportPDF}</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Cloud & Audit Status Strip */}
      <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CloudCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-[var(--theme-text)]">
              {t.cloudConnected}
            </div>
            <div className="text-[11px] text-[var(--theme-text-muted)]">
              Sincronização contínua com banco de dados estruturado em nuvem e armazenamento de artefatos.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[var(--theme-text-muted)]">
          <span>Total de Execuções: <strong className="text-[var(--theme-text)]">{runs.length}</strong></span>
          <span>Logs Registrados: <strong className="text-[var(--theme-text)]">{allLogs.length}</strong></span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--theme-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.placeholderSearchAudit}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
          />
        </div>
        <Tooltip content="Exporta todas as linhas de logs brutos com detalhe de chamadas de ferramentas e tokens" position="left">
          <button
            onClick={() => exportAuditLogsToCSV(allLogs)}
            className="px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Exportar Logs Brutos (CSV)</span>
          </button>
        </Tooltip>
      </div>

      {/* Audit Runs Table */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[var(--theme-border)] text-[var(--theme-text-muted)] font-mono text-[11px]">
                <th className="py-2.5 px-3">ID Execução</th>
                <th className="py-2.5 px-3">Fluxo / Missão</th>
                <th className="py-2.5 px-3">Operador (RBAC)</th>
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3 text-right">Tokens</th>
                <th className="py-2.5 px-3 text-right">Custo USD</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-[var(--theme-surface-subtle)] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[var(--theme-accent)]">
                    {run.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[var(--theme-text)]">{run.workflowTitle}</div>
                    <div className="text-[11px] text-[var(--theme-text-muted)] truncate max-w-xs">
                      {run.userQuery}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-[var(--theme-text)]">{run.executedBy.userName}</span>
                    <span className="text-[10px] uppercase font-mono text-[var(--theme-text-muted)] block">
                      {run.executedBy.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[var(--theme-text-muted)]">
                    {new Date(run.startedAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[var(--theme-text)]">
                    {run.totalTokens.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[var(--theme-accent)]">
                    ${run.totalCostUsd.toFixed(5)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Tooltip content="Inspecionar detalhes da auditoria e chamadas de ferramentas" position="left">
                      <button
                        onClick={() => setSelectedRunForModal(run)}
                        className="p-1 rounded text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 inline" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Gerar relatório de auditoria em PDF desta execução específica" position="left">
                      <button
                        onClick={() => exportRunToPDF(run)}
                        className="p-1 rounded text-[var(--theme-text-muted)] hover:text-rose-400 hover:bg-[var(--theme-surface)] cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5 inline" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Detail Modal */}
      {selectedRunForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] p-6 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--theme-accent)] font-semibold">
                  Auditoria Detalhada de Execução
                </span>
                <h3 className="text-base font-bold text-[var(--theme-text)]">
                  {selectedRunForModal.id} · {selectedRunForModal.workflowTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRunForModal(null)}
                className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="p-3 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] space-y-1">
                <div className="font-semibold text-[var(--theme-text)]">Prompt Original do Usuário:</div>
                <div className="text-[var(--theme-text-muted)]">{selectedRunForModal.userQuery}</div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] space-y-1">
                <div className="font-semibold text-[var(--theme-text)]">Resposta Consolidada:</div>
                <div className="text-[var(--theme-text)] whitespace-pre-wrap">{selectedRunForModal.finalOutput}</div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-[var(--theme-text)]">Etapas dos Agentes Registradas:</div>
                {selectedRunForModal.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold text-[var(--theme-text)]">{log.agentName}</span>
                      <span className="text-[var(--theme-accent)]">{log.metrics.durationMs}ms · ${log.metrics.estimatedCostUsd.toFixed(5)}</span>
                    </div>
                    <div className="text-[var(--theme-text-muted)] whitespace-pre-wrap">{log.outputContent}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--theme-border)]">
              <button
                onClick={() => exportRunToPDF(selectedRunForModal)}
                className="px-4 py-2 rounded-lg bg-[var(--theme-accent)] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
