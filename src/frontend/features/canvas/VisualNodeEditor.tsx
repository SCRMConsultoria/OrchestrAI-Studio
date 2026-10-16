import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Play,
  Shield,
  Cpu,
  Wrench,
  Sliders,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  AgentConfig,
  CanvasNode,
  CanvasEdge,
  NodeType,
  ModelDescriptor,
  ModelProvider,
} from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface VisualNodeEditorProps {
  agents: AgentConfig[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onUpdateAgent: (agent: AgentConfig) => void;
  onSaveVersion: (agentId: string, commitMsg: string) => void;
  onTestInSandbox: (agent: AgentConfig) => void;
  availableModels: ModelDescriptor[];
  currentLanguage: LanguageCode;
}

interface PaletteItem {
  type: NodeType;
  title: string;
  category: 'trigger' | 'model' | 'tool' | 'guardrail' | 'logic' | 'output';
  icon: any;
  defaultConfig: any;
  tooltip: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'trigger',
    title: 'Comando de Voz / Áudio',
    category: 'trigger',
    icon: Sparkles,
    defaultConfig: { triggerType: 'voice' },
    tooltip: 'Dispara o fluxo de raciocínio a partir de áudio ou transcrição de fala.',
  },
  {
    type: 'trigger',
    title: 'Entrada de Texto / Prompt',
    category: 'trigger',
    icon: Sparkles,
    defaultConfig: { triggerType: 'text' },
    tooltip: 'Ponto de entrada padrão para prompts digitados pelo usuário.',
  },
  {
    type: 'guardrail',
    title: 'Filtro Anti-Injeção de Prompt',
    category: 'guardrail',
    icon: Shield,
    defaultConfig: {
      guardrails: {
        blockPromptInjection: true,
        redactPii: false,
        blockedKeywords: ['ignore previous instructions', 'system prompt'],
        maxTokenCeiling: 2048,
      },
    },
    tooltip: 'Barreira de segurança contra jailbreaks e tentativas de usurpação de instrução.',
  },
  {
    type: 'guardrail',
    title: 'Redação de PII (Dados Sensíveis)',
    category: 'guardrail',
    icon: Shield,
    defaultConfig: {
      guardrails: {
        blockPromptInjection: false,
        redactPii: true,
        blockedKeywords: [],
        maxTokenCeiling: 2048,
      },
    },
    tooltip: 'Mascara automaticamente CPFs, cartões e e-mails sensíveis antes da resposta.',
  },
  {
    type: 'tool',
    title: 'Busca Web em Tempo Real',
    category: 'tool',
    icon: Wrench,
    defaultConfig: { selectedTools: ['googleSearch'] },
    tooltip: 'Conecta pesquisa externa no Google para enriquecimento factual em tempo real.',
  },
  {
    type: 'tool',
    title: 'Execução de Código Sandbox',
    category: 'tool',
    icon: Wrench,
    defaultConfig: { selectedTools: ['pythonSandbox'] },
    tooltip: 'Permite que o agente execute scripts Python isolados para cálculo numérico.',
  },
  {
    type: 'llm',
    title: 'Nó Gemini 3.8 Flash',
    category: 'model',
    icon: Cpu,
    defaultConfig: {
      modelId: 'gemini-3.8-flash',
      provider: 'google',
      temperature: 0.5,
      promptTemplate: 'Analise e processe as entradas com alta precisão: {{input}}',
    },
    tooltip: 'Modelo de raciocínio multimodal rápido ideal para decisões em tempo real.',
  },
  {
    type: 'llm',
    title: 'Nó Claude 3.5 Sonnet',
    category: 'model',
    icon: Cpu,
    defaultConfig: {
      modelId: 'claude-3-5-sonnet',
      provider: 'anthropic',
      temperature: 0.3,
      promptTemplate: 'Raciocínio lógico estruturado: {{input}}',
    },
    tooltip: 'Modelo focado em raciocínio analítico estruturado e geração técnica formal.',
  },
  {
    type: 'llm',
    title: 'Nó GPT-4o Codex',
    category: 'model',
    icon: Cpu,
    defaultConfig: {
      modelId: 'gpt-4o',
      provider: 'openai',
      temperature: 0.2,
      promptTemplate: 'Audite e gere implementações técnicas: {{input}}',
    },
    tooltip: 'Modelo avançado para refatoração de código, análise estruturada e automações.',
  },
  {
    type: 'condition',
    title: 'Condicional Se / Senão',
    category: 'logic',
    icon: Sliders,
    defaultConfig: { conditionExpr: 'hasVulnerabilities == true' },
    tooltip: 'Bifurca o fluxo de execução baseado em critérios de decisão booleana.',
  },
  {
    type: 'output',
    title: 'Síntese de Voz (TTS)',
    category: 'output',
    icon: Sparkles,
    defaultConfig: { outputFormat: 'voice_speech' },
    tooltip: 'Sintetiza e reproduz o resultado final em formato de voz neural de alta qualidade.',
  },
  {
    type: 'output',
    title: 'Resposta Formatada Markdown',
    category: 'output',
    icon: Sparkles,
    defaultConfig: { outputFormat: 'markdown' },
    tooltip: 'Formata e entrega a conclusão em texto limpo com tópicos e tabelas.',
  },
];

export const VisualNodeEditor: React.FC<VisualNodeEditorProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onUpdateAgent,
  onSaveVersion,
  onTestInSandbox,
  availableModels,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const [nodes, setNodes] = useState<CanvasNode[]>(currentAgent.nodes || []);
  const [edges, setEdges] = useState<CanvasEdge[]>(currentAgent.edges || []);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [isCommitModalOpen, setIsCommitModalOpen] = useState<boolean>(false);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  React.useEffect(() => {
    setNodes(currentAgent.nodes || []);
    setEdges(currentAgent.edges || []);
    setSelectedNodeId(null);
  }, [currentAgent.id]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const persistChanges = (newNodes: CanvasNode[], newEdges: CanvasEdge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    onUpdateAgent({
      ...currentAgent,
      nodes: newNodes,
      edges: newEdges,
    });
  };

  const handleMouseDownNode = (e: React.MouseEvent, node: CanvasNode) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDraggingNodeId(node.id);
    setDragOffset({
      x: e.clientX - canvasRect.left - node.x,
      y: e.clientY - canvasRect.top - node.y,
    });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(canvasRect.width - 240, e.clientX - canvasRect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(canvasRect.height - 120, e.clientY - canvasRect.top - dragOffset.y));

    const updatedNodes = nodes.map((n) =>
      n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n
    );
    setNodes(updatedNodes);
  };

  const handleMouseUpCanvas = () => {
    if (draggingNodeId) {
      persistChanges(nodes, edges);
      setDraggingNodeId(null);
    }
  };

  const handleAddPaletteNode = (item: PaletteItem) => {
    const id = `node-${Date.now()}`;
    const newNode: CanvasNode = {
      id,
      type: item.type,
      title: item.title,
      x: 100 + (nodes.length % 4) * 80,
      y: 80 + (nodes.length % 3) * 60,
      config: { ...item.defaultConfig },
    };

    const newNodes = [...nodes, newNode];
    persistChanges(newNodes, edges);
    setSelectedNodeId(id);
  };

  const handleSocketClick = (nodeId: string, isOutput: boolean) => {
    if (isOutput) {
      setConnectingNodeId(nodeId);
    } else {
      if (connectingNodeId && connectingNodeId !== nodeId) {
        const exists = edges.some(
          (e) => e.source === connectingNodeId && e.target === nodeId
        );
        if (!exists) {
          const newEdge: CanvasEdge = {
            id: `edge-${Date.now()}`,
            source: connectingNodeId,
            target: nodeId,
          };
          const newEdges = [...edges, newEdge];
          persistChanges(nodes, newEdges);
        }
      }
      setConnectingNodeId(null);
    }
  };

  const handleDeleteNode = (id: string) => {
    const newNodes = nodes.filter((n) => n.id !== id);
    const newEdges = edges.filter((e) => e.source !== id && e.target !== id);
    persistChanges(newNodes, newEdges);
    setSelectedNodeId(null);
  };

  const handleDeleteEdge = (edgeId: string) => {
    const newEdges = edges.filter((e) => e.id !== edgeId);
    persistChanges(nodes, newEdges);
  };

  const handleCommitSubmit = () => {
    if (!commitMessage.trim()) return;
    onSaveVersion(currentAgent.id, commitMessage.trim());
    setIsCommitModalOpen(false);
    setCommitMessage('');
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      {/* Top Controls Toolbar */}
      <div className="h-14 px-6 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider">
            Agente Ativo:
          </div>
          <Tooltip content="Selecione o agente para editar seus nós, conexões e parâmetros" position="bottom">
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
          <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {currentAgent.currentVersion}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {connectingNodeId && (
            <span className="text-xs text-amber-400 font-mono animate-pulse mr-2">
              Clique no socket esquerdo (entrada) do próximo nó...
            </span>
          )}

          <Tooltip content={t.tooltipRunEvalSuite} position="bottom">
            <button
              onClick={() => onTestInSandbox(currentAgent)}
              className="px-3.5 py-1.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:border-[var(--theme-accent)] text-[var(--theme-text)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>{t.actionTestSandbox}</span>
            </button>
          </Tooltip>

          <Tooltip content="Gera uma nova versão imutável do agente com mensagem de commit e rastreamento" position="bottom">
            <button
              onClick={() => setIsCommitModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.actionSaveVersion}</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {isSavedToast && (
        <div className="bg-emerald-500 text-slate-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
          <Check className="w-3.5 h-3.5" />
          <span>Nova versão de nós salva com sucesso no histórico de auditoria!</span>
        </div>
      )}

      {/* Main Canvas + Sidebar Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Palette */}
        <div className="w-64 border-r border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 overflow-y-auto space-y-4 shrink-0">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-text-muted)] mb-2">
              {t.titleCanvasPalette}
            </div>
            <p className="text-[11px] text-[var(--theme-text-muted)] mb-3">
              Clique em um bloco para adicionar à tela e conecte com fios lógicos.
            </p>
          </div>

          <div className="space-y-1.5">
            {PALETTE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Tooltip key={idx} content={item.tooltip} position="right" className="w-full">
                  <button
                    onClick={() => handleAddPaletteNode(item)}
                    className="w-full text-left p-2.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] hover:border-[var(--theme-accent)] hover:bg-[var(--theme-surface)] transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0" />
                      <span className="text-xs font-medium text-[var(--theme-text)] truncate">
                        {item.title}
                      </span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-[var(--theme-text-muted)] group-hover:text-[var(--theme-accent)] shrink-0" />
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Canvas Surface */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className="flex-1 relative overflow-hidden bg-[var(--theme-bg)] cursor-crosshair"
          style={{
            backgroundImage: `radial-gradient(var(--theme-border) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* SVG Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge) => {
              const srcNode = nodes.find((n) => n.id === edge.source);
              const tgtNode = nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const x1 = srcNode.x + 220;
              const y1 = srcNode.y + 36;
              const x2 = tgtNode.x;
              const y2 = tgtNode.y + 36;
              const dx = Math.abs(x2 - x1) * 0.5;

              return (
                <g key={edge.id} className="pointer-events-auto group">
                  <path
                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="var(--theme-accent)"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <circle
                    cx={(x1 + x2) / 2}
                    cy={(y1 + y2) / 2}
                    r="8"
                    fill="var(--theme-surface)"
                    stroke="var(--theme-border)"
                    className="cursor-pointer hover:stroke-rose-500 hover:fill-rose-500/20"
                    onClick={() => handleDeleteEdge(edge.id)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Rendered Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute w-56 rounded-xl border p-3.5 shadow-sm transition-shadow select-none cursor-grab active:cursor-grabbing ${
                  isSelected
                    ? 'border-[var(--theme-accent)] bg-[var(--theme-surface)] ring-2 ring-[var(--theme-accent)]/50'
                    : 'border-[var(--theme-border)] bg-[var(--theme-surface)]'
                }`}
              >
                {/* Input Socket (Left) */}
                <Tooltip content="Socket de entrada: clique para conectar o fio de origem" position="left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSocketClick(node.id, false);
                    }}
                    className="absolute -left-2.5 top-8 w-5 h-5 rounded-full bg-[var(--theme-surface)] border-2 border-[var(--theme-accent)] hover:scale-125 transition-transform flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                  </button>
                </Tooltip>

                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)]">
                    {node.type}
                  </span>
                  <Tooltip content="Excluir este nó da lógica do agente" position="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="p-1 rounded text-[var(--theme-text-muted)] hover:text-rose-400 hover:bg-[var(--theme-surface-subtle)] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Tooltip>
                </div>

                <div className="text-xs font-bold text-[var(--theme-text)] truncate">
                  {node.title}
                </div>

                <div className="text-[11px] text-[var(--theme-text-muted)] truncate mt-1">
                  {node.config.modelId ||
                    (node.config.guardrails?.blockPromptInjection && 'Shield Injeção') ||
                    (node.config.selectedTools?.[0] && `Ferramenta: ${node.config.selectedTools[0]}`) ||
                    'Pronto'}
                </div>

                {/* Output Socket (Right) */}
                <Tooltip content="Socket de saída: clique aqui para iniciar uma nova conexão" position="right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSocketClick(node.id, true);
                    }}
                    className="absolute -right-2.5 top-8 w-5 h-5 rounded-full bg-[var(--theme-surface)] border-2 border-[var(--theme-accent)] hover:scale-125 transition-transform flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                  </button>
                </Tooltip>
              </div>
            );
          })}
        </div>

        {/* Right Drawer */}
        {selectedNode && (
          <div className="w-80 border-l border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 overflow-y-auto space-y-4 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
              <div>
                <div className="text-[10px] font-mono uppercase text-[var(--theme-accent)] font-semibold">
                  Parametrização do Nó
                </div>
                <h4 className="text-sm font-bold text-[var(--theme-text)]">
                  {selectedNode.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedNode.type === 'llm' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                    Modelo de Linguagem
                  </label>
                  <select
                    value={selectedNode.config.modelId || 'gemini-3.8-flash'}
                    onChange={(e) => {
                      const modelObj = availableModels.find((m) => m.id === e.target.value);
                      const updated = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? {
                              ...n,
                              config: {
                                ...n.config,
                                modelId: e.target.value,
                                provider: (modelObj?.provider || 'google') as ModelProvider,
                              },
                            }
                          : n
                      );
                      persistChanges(updated, edges);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-medium cursor-pointer"
                  >
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.provider.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[var(--theme-text-muted)] mb-1">
                    <span>Temperatura</span>
                    <span className="font-mono">{selectedNode.config.temperature ?? 0.5}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedNode.config.temperature ?? 0.5}
                    onChange={(e) => {
                      const temp = parseFloat(e.target.value);
                      const updated = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, config: { ...n.config, temperature: temp } }
                          : n
                      );
                      persistChanges(updated, edges);
                    }}
                    className="w-full accent-[var(--theme-accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                    Template de Prompt
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.config.promptTemplate || ''}
                    onChange={(e) => {
                      const updated = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, config: { ...n.config, promptTemplate: e.target.value } }
                          : n
                      );
                      persistChanges(updated, edges);
                    }}
                    className="w-full p-2.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-mono"
                    placeholder="Use {{input}} para referenciar dados de entrada..."
                  />
                </div>
              </div>
            )}

            {selectedNode.type === 'guardrail' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)]">
                  <div>
                    <div className="text-xs font-semibold text-[var(--theme-text)]">
                      Anti-Prompt Injection
                    </div>
                    <div className="text-[10px] text-[var(--theme-text-muted)]">
                      Mitiga instruções maliciosas
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedNode.config.guardrails?.blockPromptInjection ?? true}
                    onChange={(e) => {
                      const updated = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? {
                              ...n,
                              config: {
                                ...n.config,
                                guardrails: {
                                  ...(n.config.guardrails || {
                                    blockPromptInjection: true,
                                    redactPii: false,
                                    blockedKeywords: [],
                                    maxTokenCeiling: 2048,
                                  }),
                                  blockPromptInjection: e.target.checked,
                                },
                              },
                            }
                          : n
                      );
                      persistChanges(updated, edges);
                    }}
                    className="w-4 h-4 accent-[var(--theme-accent)]"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)]">
                  <div>
                    <div className="text-xs font-semibold text-[var(--theme-text)]">
                      Redação de PII
                    </div>
                    <div className="text-[10px] text-[var(--theme-text-muted)]">
                      Mascara CPFs, e-mails e cartões
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedNode.config.guardrails?.redactPii ?? true}
                    onChange={(e) => {
                      const updated = nodes.map((n) =>
                        n.id === selectedNode.id
                          ? {
                              ...n,
                              config: {
                                ...n.config,
                                guardrails: {
                                  ...(n.config.guardrails || {
                                    blockPromptInjection: true,
                                    redactPii: false,
                                    blockedKeywords: [],
                                    maxTokenCeiling: 2048,
                                  }),
                                  redactPii: e.target.checked,
                                },
                              },
                            }
                          : n
                      );
                      persistChanges(updated, edges);
                    }}
                    className="w-4 h-4 accent-[var(--theme-accent)]"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Commit Modal */}
      {isCommitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[var(--theme-accent)]">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-bold font-display text-[var(--theme-text)]">
                {t.actionSaveVersion}
              </h3>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Gere um novo snapshot versionado dos nós, conexões e parâmetros configurados para auditoria e controle de regressão.
            </p>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Mensagem do Commit / Mudanças Feitas
              </label>
              <textarea
                rows={3}
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder={t.placeholderCommitMsg}
                className="w-full p-2.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCommitModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCommitSubmit}
                disabled={!commitMessage.trim()}
                className="px-5 py-2 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                Confirmar e Publicar Versão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
