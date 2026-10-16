import React from 'react';
import {
  GitMerge,
  Workflow,
  TestTube2,
  GitBranch,
  DollarSign,
  Users,
  ScrollText,
  Cpu,
  Layers,
} from 'lucide-react';
import { UserRole } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../components/Tooltip';

export type NavTab =
  | 'missions'
  | 'canvas'
  | 'evals'
  | 'versions'
  | 'finance'
  | 'users'
  | 'audit'
  | 'models';

interface AppSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: UserRole;
  agentCount: number;
  workflowCount: number;
  currentLanguage: LanguageCode;
  isHidden: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  agentCount,
  workflowCount,
  currentLanguage,
  isHidden,
}) => {
  if (isHidden) return null;

  const t = TRANSLATIONS[currentLanguage];

  const navItems = [
    {
      id: 'missions' as NavTab,
      label: t.navMissions,
      sublabel: t.navMissionsSub,
      icon: GitMerge,
      allowedRoles: ['admin', 'architect', 'operator', 'auditor', 'finance'],
      badge: `${workflowCount}`,
      tooltip: 'Painel operacional com entrada por voz (STT), transcrição e execução em tempo real.',
    },
    {
      id: 'canvas' as NavTab,
      label: t.navCanvas,
      sublabel: t.navCanvasSub,
      icon: Workflow,
      allowedRoles: ['admin', 'architect'],
      badge: `${agentCount}`,
      tooltip: 'Ambiente visual drag & drop para conectar modelos, ferramentas externas e barreiras de proteção.',
    },
    {
      id: 'evals' as NavTab,
      label: t.navEvals,
      sublabel: t.navEvalsSub,
      icon: TestTube2,
      allowedRoles: ['admin', 'architect'],
      tooltip: 'Sandbox interativo e bateria de avaliações em linha com juiz LLM e notas de qualidade.',
    },
    {
      id: 'versions' as NavTab,
      label: t.navVersions,
      sublabel: t.navVersionsSub,
      icon: GitBranch,
      allowedRoles: ['admin', 'architect', 'auditor'],
      tooltip: 'Linha do tempo de releases de agentes, comparador visual de diffs e rollback em 1 clique.',
    },
    {
      id: 'finance' as NavTab,
      label: t.navFinance,
      sublabel: t.navFinanceSub,
      icon: DollarSign,
      allowedRoles: ['admin', 'finance', 'auditor'],
      tooltip: 'Métricas de custos por token consumido, faturamento de clientes, markups e emissão de faturas.',
    },
    {
      id: 'users' as NavTab,
      label: t.navUsers,
      sublabel: t.navUsersSub,
      icon: Users,
      allowedRoles: ['admin'],
      tooltip: 'Gestão de contas corporativas, papéis RBAC e tetos de orçamento mensais de inferência.',
    },
    {
      id: 'audit' as NavTab,
      label: t.navAudit,
      sublabel: t.navAuditSub,
      icon: ScrollText,
      allowedRoles: ['admin', 'architect', 'operator', 'auditor', 'finance'],
      tooltip: 'Trilha de auditoria detalhada com carimbos temporais e exportação de relatórios em PDF e CSV.',
    },
    {
      id: 'models' as NavTab,
      label: t.navModels,
      sublabel: t.navModelsSub,
      icon: Cpu,
      allowedRoles: ['admin', 'architect', 'operator', 'auditor', 'finance'],
      tooltip: 'Tabela comparativa de modelos (Gemini, Claude, Codex) e ajuste fino de temperatura e prompts.',
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--theme-border)] bg-[var(--theme-surface)] flex flex-col shrink-0 select-none transition-all duration-200">
      <div className="p-4 border-b border-[var(--theme-border)]">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text)]">
          <Layers className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
          <div className="truncate">
            <span className="font-semibold block truncate">Espaço Corporativo</span>
            <span className="text-[10px] text-[var(--theme-text-muted)] block truncate">
              {t.cloudConnected}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isAllowed = item.allowedRoles.includes(userRole);
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          if (!isAllowed) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg opacity-40 cursor-not-allowed text-xs text-[var(--theme-text-muted)]"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] border border-[var(--theme-border)] px-1 rounded">
                  Restrito
                </span>
              </div>
            );
          }

          return (
            <Tooltip key={item.id} content={item.tooltip} position="right" className="w-full">
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[var(--theme-accent)] text-slate-950 font-bold shadow-xs'
                    : 'text-[var(--theme-text)] hover:bg-[var(--theme-surface-subtle)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-slate-950' : 'text-[var(--theme-accent)]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="truncate">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-slate-800' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ml-1 ${
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'bg-[var(--theme-surface-subtle)] text-[var(--theme-text-muted)] border border-[var(--theme-border)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--theme-border)] text-[11px] text-[var(--theme-text-muted)]">
        <div className="flex justify-between items-center py-1">
          <span>Latência Média:</span>
          <span className="font-mono text-[var(--theme-text)]">~850ms</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span>Guardrails Ativos:</span>
          <span className="text-emerald-400 font-semibold">100% Protegido</span>
        </div>
      </div>
    </aside>
  );
};
