import React, { useState } from 'react';
import {
  Sliders,
  Check,
  Play,
} from 'lucide-react';
import { AgentConfig, ModelDescriptor } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface ModelsCatalogPanelProps {
  availableModels: ModelDescriptor[];
  agents: AgentConfig[];
  onUpdateAgent: (agent: AgentConfig) => void;
  currentLanguage: LanguageCode;
}

export const ModelsCatalogPanel: React.FC<ModelsCatalogPanelProps> = ({
  availableModels,
  agents,
  onUpdateAgent,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [testOutput, setTestOutput] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleUpdate = (updates: Partial<AgentConfig>) => {
    const updated = { ...currentAgent, ...updates };
    onUpdateAgent(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestPrompt = async () => {
    setIsTesting(true);
    setTestOutput('');
    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Responda brevemente demonstrando seu tom e persona configurados.',
          model: currentAgent.modelId,
          provider: currentAgent.provider,
          systemInstruction: currentAgent.systemInstruction,
          temperature: currentAgent.temperature,
          tools: currentAgent.tools,
          guardrails: currentAgent.guardrails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no teste');
      setTestOutput(data.output || 'Sucesso.');
    } catch (e: any) {
      setTestOutput(`Erro: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
            Engenharia de Prompts & Modelos
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
            {t.titleModelsCatalog}
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1">
            Configure hiperparâmetros (temperatura, top-p, top-k), ferramentas conectadas e prompts de sistema.
          </p>
        </div>

        {savedSuccess && (
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Check className="w-3.5 h-3.5" />
            <span>Configurações salvas automaticamente!</span>
          </div>
        )}
      </div>

      {/* Models Catalog Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
          Modelos Suportados & Tabela de Preços por 1M Tokens
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableModels.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all ${
                currentAgent.modelId === m.id
                  ? 'border-[var(--theme-accent)] bg-[var(--theme-surface)] ring-1 ring-[var(--theme-accent)]/40 shadow-sm'
                  : 'border-[var(--theme-border)] bg-[var(--theme-surface)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--theme-text)]">{m.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
                  {m.badge}
                </span>
              </div>

              <p className="text-xs text-[var(--theme-text-muted)] line-clamp-2 mb-3">
                {m.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-[var(--theme-border)] pt-2 text-[var(--theme-text-muted)]">
                <div>
                  Input: <strong className="text-[var(--theme-text)]">${m.inputCostPer1M}</strong>
                </div>
                <div>
                  Output: <strong className="text-[var(--theme-text)]">${m.outputCostPer1M}</strong>
                </div>
                <div className="col-span-2">
                  Janela: {(m.contextWindow / 1000).toFixed(0)}k tokens
                </div>
              </div>

              <div className="mt-3 pt-2">
                <Tooltip content={`Atribui o modelo ${m.name} (${m.provider}) como o cérebro cognitivo deste agente`} position="top" className="w-full">
                  <button
                    onClick={() => handleUpdate({ modelId: m.id, provider: m.provider })}
                    className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      currentAgent.modelId === m.id
                        ? 'bg-[var(--theme-accent)] text-slate-950 font-bold'
                        : 'border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] hover:border-[var(--theme-accent)]'
                    }`}
                  >
                    {currentAgent.modelId === m.id ? 'Modelo Ativo no Agente' : 'Atribuir ao Agente'}
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Fine Tuning Form */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--theme-accent)]" />
            <h3 className="text-sm font-bold text-[var(--theme-text)]">
              Parametrização do Agente: {currentAgent.name} ({currentAgent.role})
            </h3>
          </div>

          <Tooltip content="Selecione o agente cujos parâmetros de modelo e prompt deseja ajustar" position="left">
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-medium cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </Tooltip>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[var(--theme-text)]">
              <span>Temperatura (Criatividade)</span>
              <span className="font-mono text-[var(--theme-accent)]">{currentAgent.temperature}</span>
            </div>
            <Tooltip content="Valores menores favorecem respostas factuais e determinísticas; maiores trazem mais criatividade." position="top" className="w-full">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentAgent.temperature}
                onChange={(e) => handleUpdate({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-[var(--theme-accent)]"
              />
            </Tooltip>
            <div className="flex justify-between text-[10px] text-[var(--theme-text-muted)]">
              <span>0.0 (Factual)</span>
              <span>1.0 (Criativo)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[var(--theme-text)]">
              <span>Top-P (Nucleus Sampling)</span>
              <span className="font-mono text-[var(--theme-accent)]">{currentAgent.topP}</span>
            </div>
            <Tooltip content="Controla a massa de probabilidade cumulativa considerada na geração de cada token." position="top" className="w-full">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={currentAgent.topP}
                onChange={(e) => handleUpdate({ topP: parseFloat(e.target.value) })}
                className="w-full accent-[var(--theme-accent)]"
              />
            </Tooltip>
            <div className="flex justify-between text-[10px] text-[var(--theme-text-muted)]">
              <span>0.1 (Estrito)</span>
              <span>1.0 (Diverso)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--theme-text)] block">
              Voz Sintética TTS (Gemini Speech)
            </label>
            <Tooltip content="Selecione o timbre e persona da voz neural usada na reprodução de áudio" position="top" className="w-full">
              <select
                value={currentAgent.voiceConfig.voiceName}
                onChange={(e) =>
                  handleUpdate({
                    voiceConfig: {
                      ...currentAgent.voiceConfig,
                      voiceName: e.target.value as any,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs cursor-pointer"
              >
                <option value="Kore">Kore (Voz Feminina Executiva e Clara)</option>
                <option value="Puck">Puck (Voz Articulada e Analítica)</option>
                <option value="Charon">Charon (Voz Profunda e Autoritária)</option>
                <option value="Zephyr">Zephyr (Voz Ágil e Moderna)</option>
                <option value="Fenrir">Fenrir (Voz Forte de Baixo Registro)</option>
              </select>
            </Tooltip>
          </div>
        </div>

        {/* System Prompt Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--theme-text)] block">
            Prompt de Sistema (System Instruction)
          </label>
          <textarea
            rows={4}
            value={currentAgent.systemInstruction}
            onChange={(e) => handleUpdate({ systemInstruction: e.target.value })}
            className="w-full p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
          />
        </div>

        {/* Connected Tools */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--theme-text)] block">
            Ferramentas Externas Conectadas
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'googleSearch', label: 'Busca Google em Tempo Real', desc: 'Permite grounding em notícias e páginas web em tempo real' },
              { id: 'pythonSandbox', label: 'Sandbox Python / Código', desc: 'Habilita execução e cálculo numérico em sandbox seguro' },
              { id: 'calculator', label: 'Calculadora de Precisão', desc: 'Garante exatidão aritmética sem alucinações matemáticas' },
              { id: 'webScraper', label: 'Extrator de Conteúdo Web', desc: 'Extrai texto limpo de links e documentos citados' },
            ].map((tool) => {
              const isChecked = currentAgent.tools.includes(tool.id as any);
              return (
                <Tooltip key={tool.id} content={tool.desc} position="top">
                  <label
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-[var(--theme-accent)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)]'
                        : 'border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newTools = e.target.checked
                          ? [...currentAgent.tools, tool.id as any]
                          : currentAgent.tools.filter((t) => t !== tool.id);
                        handleUpdate({ tools: newTools });
                      }}
                      className="accent-[var(--theme-accent)] cursor-pointer"
                    />
                    <span>{tool.label}</span>
                  </label>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Test Prompt & Response */}
        <div className="pt-2 border-t border-[var(--theme-border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-xs text-[var(--theme-text-muted)]">
            Teste se o modelo responde adequadamente com as novas instruções.
          </div>
          <Tooltip content="Executa uma chamada de teste rápida no backend com os parâmetros configurados">
            <button
              onClick={handleTestPrompt}
              disabled={isTesting}
              className="px-4 py-2 rounded-lg bg-[var(--theme-accent)] text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isTesting ? 'Testando...' : 'Testar Prompt no Modelo'}</span>
            </button>
          </Tooltip>
        </div>

        {testOutput && (
          <div className="p-3.5 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text)] font-mono whitespace-pre-wrap">
            {testOutput}
          </div>
        )}
      </div>
    </div>
  );
};
