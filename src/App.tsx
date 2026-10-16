import React, { useState, useEffect } from 'react';
import {
  AgentConfig,
  WorkflowDefinition,
  WorkflowRun,
  EvaluationCase,
  AgentVersion,
  UserAccount,
  InvoiceItem,
  UserRole,
  ThemeMode,
  CustomThemeSettings,
  ModelDescriptor,
} from './types';

// Modular Frontend Architecture (Features & Shared Modules)
import { AppHeader } from './frontend/shared/layout/AppHeader';
import { AppSidebar, NavTab } from './frontend/shared/layout/AppSidebar';
import { WorkflowRunner } from './frontend/features/orchestrator/WorkflowRunner';
import { VisualNodeEditor } from './frontend/features/canvas/VisualNodeEditor';
import { PreviewAndEvals } from './frontend/features/evals/PreviewAndEvals';
import { VersionControlPanel } from './frontend/features/versioning/VersionControlPanel';
import { FinancialDashboard } from './frontend/features/financial/FinancialDashboard';
import { UserManagementPanel } from './frontend/features/users/UserManagementPanel';
import { AuditAndReportsPanel } from './frontend/features/audit/AuditAndReportsPanel';
import { ModelsCatalogPanel } from './frontend/features/models/ModelsCatalogPanel';
import { CustomStudioModal } from './frontend/features/theme/CustomStudioModal';
import { Tooltip } from './frontend/shared/components/Tooltip';

// Angular Signals & Persistent Storage Engine
import { signal } from './frontend/core/signals/signal';
import { useSignal } from './frontend/core/signals/reactAdapter';
import { PersistentStorage } from './frontend/core/storage/persistentStorage';
import { LanguageCode, TRANSLATIONS } from './frontend/core/constants/translations';
import { USER_CONSTANTS } from './frontend/core/constants/userConstants';
import { PanelLeftOpen } from 'lucide-react';
import { ApiService } from './frontend/core/services/apiService';

// Initialize Angular Signals with persisted state
const languageSignal = signal<LanguageCode>(PersistentStorage.getLanguage('pt'));
const sidebarHiddenSignal = signal<boolean>(PersistentStorage.getSidebarHidden(false));
const themeModeSignal = signal<ThemeMode>(PersistentStorage.getThemeMode('cockpit'));
const customThemeSignal = signal<CustomThemeSettings>(
  PersistentStorage.getCustomTheme({
    bg: '#090d16',
    surface: '#0f172a',
    surfaceSubtle: '#1e293b',
    border: '#1e293b',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    radius: 8,
  })
);

export default function App() {
  // Reactive Angular-style Signal bindings
  const [currentLanguage, setLanguage] = useSignal(languageSignal);
  const [isSidebarHidden, setSidebarHidden] = useSignal(sidebarHiddenSignal);
  const [currentTheme, setCurrentTheme] = useSignal(themeModeSignal);
  const [customThemeSettings, setCustomThemeSettings] = useSignal(customThemeSignal);

  // Entities state loaded dynamically from PostgreSQL Database & Persistent Cache
  const [models, setModels] = useState<ModelDescriptor[]>(() =>
    PersistentStorage.getModels([])
  );
  const [agents, setAgents] = useState<AgentConfig[]>(() =>
    PersistentStorage.getAgents([])
  );
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(() =>
    PersistentStorage.getWorkflows([])
  );
  const [runs, setRuns] = useState<WorkflowRun[]>(() =>
    PersistentStorage.getRuns([])
  );
  const [evalCases, setEvalCases] = useState<EvaluationCase[]>(() =>
    PersistentStorage.getEvalCases([])
  );
  const [versions, setVersions] = useState<AgentVersion[]>(() =>
    PersistentStorage.getVersions([])
  );
  const [users, setUsers] = useState<UserAccount[]>(() =>
    PersistentStorage.getUsers([])
  );
  const [invoices, setInvoices] = useState<InvoiceItem[]>(() =>
    PersistentStorage.getInvoices([])
  );

  const [activeTab, setActiveTab] = useState<NavTab>('missions');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState<boolean>(false);

  // Load baseline & user data dynamically from backend PostgreSQL / database API
  useEffect(() => {
    ApiService.loadInitialData().then((dbData) => {
      if (dbData) {
        if (dbData.models?.length) {
          setModels(dbData.models);
          PersistentStorage.setModels(dbData.models);
        }
        if (dbData.agents?.length) {
          setAgents(dbData.agents);
          PersistentStorage.setAgents(dbData.agents);
          setSelectedAgentId((prev) => prev || dbData.agents[0].id);
        }
        if (dbData.workflows?.length) {
          setWorkflows(dbData.workflows);
          PersistentStorage.setWorkflows(dbData.workflows);
        }
        if (dbData.runs?.length) {
          setRuns(dbData.runs);
          PersistentStorage.setRuns(dbData.runs);
        }
        if (dbData.evals?.length) {
          setEvalCases(dbData.evals);
          PersistentStorage.setEvalCases(dbData.evals);
        }
        if (dbData.versions?.length) {
          setVersions(dbData.versions);
          PersistentStorage.setVersions(dbData.versions);
        }
        if (dbData.users?.length) {
          setUsers(dbData.users);
          PersistentStorage.setUsers(dbData.users);
        }
        if (dbData.invoices?.length) {
          setInvoices(dbData.invoices);
          PersistentStorage.setInvoices(dbData.invoices);
        }
      }
    });
  }, []);

  // Persist language on change
  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    PersistentStorage.setLanguage(newLang);
  };

  // Persist sidebar toggle on change
  const handleToggleSidebar = () => {
    const nextVal = !isSidebarHidden;
    setSidebarHidden(nextVal);
    PersistentStorage.setSidebarHidden(nextVal);
  };

  // Persist theme changes
  const handleThemeChange = (newTheme: ThemeMode) => {
    setCurrentTheme(newTheme);
    PersistentStorage.setThemeMode(newTheme);
  };

  const handleApplyCustomTheme = (newSettings: CustomThemeSettings) => {
    setCustomThemeSettings(newSettings);
    PersistentStorage.setCustomTheme(newSettings);
    setCurrentTheme('custom');
    PersistentStorage.setThemeMode('custom');
  };

  const currentUser = users.find((u) => u.role === currentRole) || users[0] || USER_CONSTANTS.DEFAULT_FALLBACK_USER;
  const t = TRANSLATIONS[currentLanguage];

  // Theme application via CSS variables
  const getThemeStyle = (): React.CSSProperties => {
    if (currentTheme === 'cockpit') {
      return {
        '--theme-bg': '#090d16',
        '--theme-surface': '#0f172a',
        '--theme-surface-subtle': '#162033',
        '--theme-border': '#1e293b',
        '--theme-accent': '#06b6d4',
        '--theme-accent-hover': '#0891b2',
        '--theme-text': '#f1f5f9',
        '--theme-text-muted': '#94a3b8',
      } as React.CSSProperties;
    }

    if (currentTheme === 'saas') {
      return {
        '--theme-bg': '#f8fafc',
        '--theme-surface': '#ffffff',
        '--theme-surface-subtle': '#f1f5f9',
        '--theme-border': '#e2e8f0',
        '--theme-accent': '#4f46e5',
        '--theme-accent-hover': '#4338ca',
        '--theme-text': '#0f172a',
        '--theme-text-muted': '#64748b',
      } as React.CSSProperties;
    }

    if (currentTheme === 'minimal') {
      return {
        '--theme-bg': '#111318',
        '--theme-surface': '#181b22',
        '--theme-surface-subtle': '#212631',
        '--theme-border': '#2d3342',
        '--theme-accent': '#10b981',
        '--theme-accent-hover': '#059669',
        '--theme-text': '#f8fafc',
        '--theme-text-muted': '#94a3b8',
      } as React.CSSProperties;
    }

    // Custom Studio Freedom Theme
    return {
      '--theme-bg': customThemeSettings.bg,
      '--theme-surface': customThemeSettings.surface,
      '--theme-surface-subtle': customThemeSettings.surfaceSubtle,
      '--theme-border': customThemeSettings.border,
      '--theme-accent': customThemeSettings.accent,
      '--theme-accent-hover': customThemeSettings.accentHover,
      '--theme-text': customThemeSettings.text,
      '--theme-text-muted': customThemeSettings.textMuted,
    } as React.CSSProperties;
  };

  // Handlers with persistent storage & PostgreSQL backend synchronization
  const handleAddRun = (newRun: WorkflowRun) => {
    setRuns((prev) => {
      const updated = [newRun, ...prev];
      PersistentStorage.setRuns(updated);
      return updated;
    });
    ApiService.saveRun(newRun);
  };

  const handleUpdateAgent = (updatedAgent: AgentConfig) => {
    setAgents((prev) => {
      const updated = prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a));
      PersistentStorage.setAgents(updated);
      return updated;
    });
    ApiService.saveAgent(updatedAgent);
  };

  const handleSaveVersion = (agentId: string, commitMsg: string) => {
    const targetAgent = agents.find((a) => a.id === agentId);
    if (!targetAgent) return;

    const parts = targetAgent.currentVersion.replace('v', '').split('.');
    const nextMinor = parseInt(parts[1] || '0') + 1;
    const nextVersionTag = `v${parts[0]}.${nextMinor}.0`;

    const newVersionObj: AgentVersion = {
      versionId: `ver-${agentId}-${nextVersionTag}`,
      agentId,
      versionNumber: nextVersionTag,
      commitMessage: commitMsg,
      createdAt: new Date().toISOString(),
      authorEmail: currentUser.email,
      nodesSnapshot: targetAgent.nodes,
      edgesSnapshot: targetAgent.edges,
      evalScoreAvg: 92,
      isProduction: true,
    };

    setVersions((prev) => {
      const updated = [
        newVersionObj,
        ...prev.map((v) => (v.agentId === agentId ? { ...v, isProduction: false } : v)),
      ];
      PersistentStorage.setVersions(updated);
      return updated;
    });

    handleUpdateAgent({
      ...targetAgent,
      currentVersion: nextVersionTag,
    });
  };

  const handleRollbackToVersion = (agentId: string, versionId: string) => {
    const targetVer = versions.find((v) => v.versionId === versionId);
    const targetAgent = agents.find((a) => a.id === agentId);
    if (!targetVer || !targetAgent) return;

    setVersions((prev) => {
      const updated = prev.map((v) =>
        v.agentId === agentId ? { ...v, isProduction: v.versionId === versionId } : v
      );
      PersistentStorage.setVersions(updated);
      return updated;
    });

    handleUpdateAgent({
      ...targetAgent,
      currentVersion: targetVer.versionNumber,
      nodes: targetVer.nodesSnapshot,
      edges: targetVer.edgesSnapshot,
    });
  };

  const handleAddEvalCase = (evalCase: EvaluationCase) => {
    setEvalCases((prev) => {
      const updated = [evalCase, ...prev];
      PersistentStorage.setEvalCases(updated);
      return updated;
    });
    ApiService.saveEval(evalCase);
  };

  const handleAddInvoice = (inv: InvoiceItem) => {
    setInvoices((prev) => {
      const updated = [inv, ...prev];
      PersistentStorage.setInvoices(updated);
      return updated;
    });
  };

  const handleAddUser = (user: UserAccount) => {
    setUsers((prev) => {
      const updated = [...prev, user];
      PersistentStorage.setUsers(updated);
      return updated;
    });
    ApiService.saveUser(user);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      PersistentStorage.setUsers(updated);
      const target = updated.find((u) => u.id === userId);
      if (target) ApiService.saveUser(target);
      return updated;
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) => {
      const updated: UserAccount[] = prev.map((u) =>
        u.id === userId
          ? { ...u, status: (u.status === 'active' ? 'suspended' : 'active') as 'active' | 'suspended' }
          : u
      );
      PersistentStorage.setUsers(updated);
      const target = updated.find((u) => u.id === userId);
      if (target) ApiService.saveUser(target);
      return updated;
    });
  };

  const handleUpdateBudgetCap = (userId: string, newCap: number) => {
    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === userId ? { ...u, monthlyBudgetCapUsd: newCap } : u
      );
      PersistentStorage.setUsers(updated);
      const target = updated.find((u) => u.id === userId);
      if (target) ApiService.saveUser(target);
      return updated;
    });
  };

  // Compute tokens count across runs
  const totalTokensAccumulated =
    runs.reduce((acc, r) => acc + r.totalTokens, 0) + 1450000;

  return (
    <div
      style={getThemeStyle()}
      className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-200"
    >
      {/* App Header with Multi-language, Theme, Audio, Role & Sidebar Toggle */}
      <AppHeader
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudioMute={() => setIsAudioMuted(!isAudioMuted)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        isSidebarHidden={isSidebarHidden}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar (Hideable/Collapsible with Persistence) */}
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentRole}
          agentCount={agents.length}
          workflowCount={workflows.length}
          currentLanguage={currentLanguage}
          isHidden={isSidebarHidden}
        />

        {/* Quick floating expand button when sidebar is hidden */}
        {isSidebarHidden && (
          <div className="absolute left-3 top-3 z-30">
            <Tooltip content={t.tooltipSidebarToggle} position="right">
              <button
                onClick={handleToggleSidebar}
                className="p-2 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-accent)] shadow-lg hover:border-[var(--theme-accent)] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                aria-label={t.showSidebar}
              >
                <PanelLeftOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t.showSidebar}</span>
              </button>
            </Tooltip>
          </div>
        )}

        {/* Dynamic Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--theme-bg)]">
          {activeTab === 'missions' && (
            <WorkflowRunner
              workflows={workflows}
              agents={agents}
              runs={runs}
              onAddRun={handleAddRun}
              currentUser={currentUser}
              currentLanguage={currentLanguage}
              onSelectAgentForCanvas={(id) => {
                setSelectedAgentId(id);
                setActiveTab('canvas');
              }}
            />
          )}

          {activeTab === 'canvas' && (
            <VisualNodeEditor
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              onUpdateAgent={handleUpdateAgent}
              onSaveVersion={handleSaveVersion}
              onTestInSandbox={(ag) => {
                setSelectedAgentId(ag.id);
                setActiveTab('evals');
              }}
              availableModels={models}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'evals' && (
            <PreviewAndEvals
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              evalCases={evalCases}
              onAddEvalCase={handleAddEvalCase}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'versions' && (
            <VersionControlPanel
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              versions={versions}
              onRollbackToVersion={handleRollbackToVersion}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'finance' && (
            <FinancialDashboard
              invoices={invoices}
              onAddInvoice={handleAddInvoice}
              totalRunsCount={runs.length}
              totalTokensCount={totalTokensAccumulated}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'users' && (
            <UserManagementPanel
              users={users}
              onAddUser={handleAddUser}
              onUpdateUserRole={handleUpdateUserRole}
              onToggleUserStatus={handleToggleUserStatus}
              onUpdateBudgetCap={handleUpdateBudgetCap}
              currentLanguage={currentLanguage}
            />
          )}

          {activeTab === 'audit' && (
            <AuditAndReportsPanel runs={runs} currentLanguage={currentLanguage} />
          )}

          {activeTab === 'models' && (
            <ModelsCatalogPanel
              availableModels={models}
              agents={agents}
              onUpdateAgent={handleUpdateAgent}
              currentLanguage={currentLanguage}
            />
          )}
        </main>
      </div>

      {/* Custom Theme Studio Modal */}
      <CustomStudioModal
        isOpen={isCustomStudioOpen}
        onClose={() => setIsCustomStudioOpen(false)}
        customTheme={customThemeSettings}
        onApplyTheme={handleApplyCustomTheme}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
