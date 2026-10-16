import {
  CustomThemeSettings,
  ThemeMode,
  AgentConfig,
  AgentVersion,
  WorkflowDefinition,
  WorkflowRun,
  UserAccount,
  InvoiceItem,
  EvaluationCase,
} from '../../../types';
import { LanguageCode } from '../constants/translations';

const STORAGE_KEYS = {
  THEME_MODE: 'orchestrai_theme_mode',
  CUSTOM_THEME: 'orchestrai_custom_theme',
  LANGUAGE: 'orchestrai_language',
  SIDEBAR_HIDDEN: 'orchestrai_sidebar_hidden',
  AGENTS: 'orchestrai_agents',
  VERSIONS: 'orchestrai_versions',
  WORKFLOWS: 'orchestrai_workflows',
  RUNS: 'orchestrai_runs',
  USERS: 'orchestrai_users',
  INVOICES: 'orchestrai_invoices',
  EVALS: 'orchestrai_eval_cases',
};

export class PersistentStorage {
  public static getThemeMode(defaultMode: ThemeMode = 'cockpit'): ThemeMode {
    if (typeof window === 'undefined') return defaultMode;
    return (localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode) || defaultMode;
  }

  public static setThemeMode(mode: ThemeMode): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }

  public static getCustomTheme(fallback: CustomThemeSettings): CustomThemeSettings {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEME);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setCustomTheme(theme: CustomThemeSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_THEME, JSON.stringify(theme));
  }

  public static getLanguage(fallback: LanguageCode = 'pt'): LanguageCode {
    if (typeof window === 'undefined') return fallback;
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as LanguageCode) || fallback;
  }

  public static setLanguage(lang: LanguageCode): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  public static getSidebarHidden(fallback: boolean = false): boolean {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.SIDEBAR_HIDDEN);
    return raw ? raw === 'true' : fallback;
  }

  public static setSidebarHidden(hidden: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_HIDDEN, hidden ? 'true' : 'false');
  }

  public static getAgents(fallback: AgentConfig[]): AgentConfig[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setAgents(agents: AgentConfig[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  }

  public static getVersions(fallback: AgentVersion[]): AgentVersion[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.VERSIONS);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setVersions(versions: AgentVersion[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions));
  }

  public static getWorkflows(fallback: WorkflowDefinition[]): WorkflowDefinition[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setWorkflows(workflows: WorkflowDefinition[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
  }

  public static getRuns(fallback: WorkflowRun[]): WorkflowRun[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.RUNS);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setRuns(runs: WorkflowRun[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
  }

  public static getUsers(fallback: UserAccount[]): UserAccount[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setUsers(users: UserAccount[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  public static getInvoices(fallback: InvoiceItem[]): InvoiceItem[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setInvoices(invoices: InvoiceItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  public static getEvalCases(fallback: EvaluationCase[]): EvaluationCase[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(STORAGE_KEYS.EVALS);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  public static setEvalCases(cases: EvaluationCase[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.EVALS, JSON.stringify(cases));
  }
}
