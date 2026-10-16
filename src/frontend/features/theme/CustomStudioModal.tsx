import React, { useState } from 'react';
import { Palette, Check, RefreshCw } from 'lucide-react';
import { CustomThemeSettings } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface CustomStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTheme: CustomThemeSettings;
  onApplyTheme: (settings: CustomThemeSettings) => void;
  currentLanguage: LanguageCode;
}

export const CustomStudioModal: React.FC<CustomStudioModalProps> = ({
  isOpen,
  onClose,
  customTheme,
  onApplyTheme,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [bg, setBg] = useState<string>(customTheme.bg);
  const [surface, setSurface] = useState<string>(customTheme.surface);
  const [accent, setAccent] = useState<string>(customTheme.accent);
  const [text, setText] = useState<string>(customTheme.text);
  const [radius, setRadius] = useState<number>(customTheme.radius);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyTheme({
      bg,
      surface,
      surfaceSubtle: surface === '#ffffff' ? '#f8fafc' : '#1e293b',
      border: surface === '#ffffff' ? '#e2e8f0' : '#2a2f3f',
      accent,
      accentHover: accent,
      text,
      textMuted: text === '#ffffff' ? '#94a3b8' : '#64748b',
      radius,
    });
    onClose();
  };

  const handleReset = () => {
    setBg('#090d16');
    setSurface('#0f172a');
    setAccent('#06b6d4');
    setText('#f1f5f9');
    setRadius(8);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-2 text-[var(--theme-accent)]">
            <Palette className="w-5 h-5" />
            <h3 className="text-base font-bold font-display text-[var(--theme-text)]">
              {t.titleCustomStudio}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[var(--theme-text-muted)]">
          Personalize livremente as cores de fundo, cartões, tipografia e o acento da interface. As alterações serão salvas para futuros acessos.
        </p>

        <div className="space-y-4 text-xs">
          {/* Cor de Fundo */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--theme-text)]">Fundo do Canvas (Background):</span>
            <div className="flex items-center gap-2">
              <Tooltip content="Escolha a cor principal de fundo da tela">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-8 h-8 rounded border border-[var(--theme-border)] cursor-pointer"
                />
              </Tooltip>
              <span className="font-mono text-[var(--theme-text-muted)]">{bg}</span>
            </div>
          </div>

          {/* Cor da Superfície */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--theme-text)]">Superfícies & Cartões:</span>
            <div className="flex items-center gap-2">
              <Tooltip content="Escolha a cor dos cartões e painéis laterais">
                <input
                  type="color"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  className="w-8 h-8 rounded border border-[var(--theme-border)] cursor-pointer"
                />
              </Tooltip>
              <span className="font-mono text-[var(--theme-text-muted)]">{surface}</span>
            </div>
          </div>

          {/* Cor de Acento */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--theme-text)]">Cor de Acento Principal:</span>
            <div className="flex items-center gap-2">
              <Tooltip content="Cor de destaque usada em botões de ação e status ativo">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="w-8 h-8 rounded border border-[var(--theme-border)] cursor-pointer"
                />
              </Tooltip>
              <span className="font-mono text-[var(--theme-text-muted)]">{accent}</span>
            </div>
          </div>

          {/* Cor do Texto */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--theme-text)]">Cor do Texto Principal:</span>
            <div className="flex items-center gap-2">
              <Tooltip content="Cor dos títulos e corpos de texto">
                <input
                  type="color"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-8 h-8 rounded border border-[var(--theme-border)] cursor-pointer"
                />
              </Tooltip>
              <span className="font-mono text-[var(--theme-text-muted)]">{text}</span>
            </div>
          </div>

          {/* Raio de Cantos */}
          <div>
            <div className="flex justify-between font-semibold text-[var(--theme-text)] mb-1">
              <span>Raio de Bordas:</span>
              <span className="font-mono text-[var(--theme-accent)]">{radius}px</span>
            </div>
            <Tooltip content="Arraste para ajustar o arredondamento de botões e cartões" position="top" className="w-full">
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full accent-[var(--theme-accent)]"
              />
            </Tooltip>
          </div>
        </div>

        {/* Live Preview Sample */}
        <div
          style={{ backgroundColor: bg, borderColor: accent, borderRadius: `${radius}px` }}
          className="p-3 border text-xs space-y-1.5 transition-all shadow-inner"
        >
          <div style={{ color: text }} className="font-bold">
            Pré-visualização do Tema
          </div>
          <div style={{ backgroundColor: surface, color: accent }} className="p-2 rounded font-mono text-[11px]">
            Botão de Exemplo / Cartão Estilizado
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-border)]">
          <Tooltip content="Restaura os valores para o padrão do Cockpit Studio">
            <button
              onClick={handleReset}
              className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.actionResetTheme}</span>
            </button>
          </Tooltip>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] cursor-pointer"
            >
              Cancelar
            </button>
            <Tooltip content="Grava a customização de cores e dimensões para uso permanente no navegador">
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-[var(--theme-accent)] text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.actionSaveCustomTheme}</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
