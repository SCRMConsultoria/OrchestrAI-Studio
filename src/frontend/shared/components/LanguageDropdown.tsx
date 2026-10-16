import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from './Tooltip';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
  nativeLabel: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'pt', label: 'Português (BR)', flag: '🇧🇷', nativeLabel: 'Português' },
  { code: 'en', label: 'English (US)', flag: '🇺🇸', nativeLabel: 'English' },
  { code: 'fr', label: 'Français (FR)', flag: '🇫🇷', nativeLabel: 'Français' },
  { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺', nativeLabel: 'Русский' },
  { code: 'zh', label: '中文 (ZH)', flag: '🇨🇳', nativeLabel: '简体中文' },
  { code: 'de', label: 'Deutsch (DE)', flag: '🇩🇪', nativeLabel: 'Deutsch' },
];

interface LanguageDropdownProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  tooltipText: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLanguage,
  onLanguageChange,
  tooltipText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === currentLanguage) ||
    LANGUAGE_OPTIONS[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  const triggerButton = (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:border-[var(--theme-accent)] transition-all cursor-pointer text-xs font-medium text-[var(--theme-text)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <span className="text-sm select-none leading-none">{currentOption.flag}</span>
      <span className="font-semibold text-xs text-[var(--theme-text)]">
        {currentOption.label}
      </span>
      <ChevronDown
        className={`w-3.5 h-3.5 text-[var(--theme-text-muted)] transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-[var(--theme-accent)]' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* If open, suppress tooltip so it never obscures the dropdown menu */}
      {isOpen ? (
        triggerButton
      ) : (
        <Tooltip content={tooltipText} position="bottom">
          {triggerButton}
        </Tooltip>
      )}

      {/* Custom styled dropdown menu with perfect contrast and theme integration */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
          role="listbox"
          aria-label="Selecionar Idioma"
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-muted)] border-b border-[var(--theme-border)]">
            Idiomas Suportados
          </div>
          <div className="py-1">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = opt.code === currentLanguage;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] font-bold'
                      : 'text-[var(--theme-text)] hover:bg-[var(--theme-surface-subtle)] hover:text-[var(--theme-accent)]'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{opt.flag}</span>
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-[10px] text-[var(--theme-text-muted)]">
                        {opt.nativeLabel}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
