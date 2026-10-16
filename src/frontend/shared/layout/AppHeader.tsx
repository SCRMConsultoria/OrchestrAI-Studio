import React from 'react';
import {
  Sparkles,
  Shield,
  Palette,
  Volume2,
  VolumeX,
  CloudCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
} from 'lucide-react';
import { UserRole, ThemeMode, UserAccount } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../components/Tooltip';
import { LanguageDropdown } from '../components/LanguageDropdown';

interface AppHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: UserAccount;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenCustomStudio: () => void;
  isAudioMuted: boolean;
  onToggleAudioMute: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isSidebarHidden: boolean;
  onToggleSidebar: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  currentTheme,
  onThemeChange,
  onOpenCustomStudio,
  isAudioMuted,
  onToggleAudioMute,
  currentLanguage,
  onLanguageChange,
  isSidebarHidden,
  onToggleSidebar,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="h-16 px-5 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] flex items-center justify-between shrink-0 transition-colors">
      {/* Brand & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Sidebar Hide/Show Button */}
        <Tooltip content={t.tooltipSidebarToggle} position="bottom">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:border-[var(--theme-accent)] text-[var(--theme-text)] transition-colors cursor-pointer"
            title={isSidebarHidden ? t.showSidebar : t.hideSidebar}
          >
            {isSidebarHidden ? (
              <PanelLeftOpen className="w-4 h-4 text-[var(--theme-accent)]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-[var(--theme-text-muted)]" />
            )}
          </button>
        </Tooltip>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--theme-accent)] flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-display tracking-tight text-[var(--theme-text)]">
              {t.brandTitle}
            </div>
            <div className="text-[10px] text-[var(--theme-text-muted)] flex items-center gap-1.5 font-mono">
              <span>{t.brandSubtitle}</span>
              <span aria-hidden="true">·</span>
              <Tooltip content="Persistência em nuvem e armazenamento local sincronizados" position="bottom">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold cursor-help">
                  <CloudCheck className="w-3 h-3 inline" /> {t.cloudConnected}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Center status */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{t.reactiveEngineActive}</span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Custom Multi-language dropdown */}
        <LanguageDropdown
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          tooltipText={t.tooltipLangSelector}
        />

        {/* Audio Mute/Unmute */}
        <Tooltip content={isAudioMuted ? t.audioMuted : t.audioActive} position="bottom">
          <button
            onClick={onToggleAudioMute}
            className="p-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] transition-colors cursor-pointer"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[var(--theme-accent)]" />
            )}
          </button>
        </Tooltip>

        {/* Theme Selector */}
        <Tooltip content={t.tooltipThemeToggle} position="bottom">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)]">
            <button
              onClick={() => onThemeChange('cockpit')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                currentTheme === 'cockpit'
                  ? 'bg-[var(--theme-accent)] text-slate-950 font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
              }`}
            >
              {t.themeCockpit}
            </button>
            <button
              onClick={() => onThemeChange('saas')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                currentTheme === 'saas'
                  ? 'bg-[var(--theme-accent)] text-white font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
              }`}
            >
              {t.themeSaas}
            </button>
            <button
              onClick={() => onThemeChange('minimal')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                currentTheme === 'minimal'
                  ? 'bg-[var(--theme-accent)] text-slate-950 font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
              }`}
            >
              {t.themeMinimal}
            </button>
            <button
              onClick={onOpenCustomStudio}
              className={`px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                currentTheme === 'custom'
                  ? 'bg-[var(--theme-accent)] text-slate-950 font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>{t.themeCustom}</span>
            </button>
          </div>
        </Tooltip>

        {/* RBAC Role Selector Dropdown */}
        <Tooltip content={t.tooltipRoleSelector} position="bottom">
          <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--theme-border)]">
            <Shield className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-[var(--theme-text)] rounded-md px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] cursor-pointer"
            >
              <option value="admin">Admin ({currentUser.name})</option>
              <option value="architect">Arquiteto de IA</option>
              <option value="operator">Operador</option>
              <option value="auditor">Auditor</option>
              <option value="finance">Financeiro</option>
            </select>
          </div>
        </Tooltip>
      </div>
    </header>
  );
};
