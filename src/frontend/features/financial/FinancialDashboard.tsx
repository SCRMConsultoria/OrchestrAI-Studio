import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  Percent,
} from 'lucide-react';
import { InvoiceItem } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface FinancialDashboardProps {
  invoices: InvoiceItem[];
  onAddInvoice: (inv: InvoiceItem) => void;
  totalRunsCount: number;
  totalTokensCount: number;
  currentLanguage: LanguageCode;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  invoices,
  onAddInvoice,
  totalTokensCount,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [markupPercent, setMarkupPercent] = useState<number>(45);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [newClient, setNewClient] = useState<string>('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newTokens, setNewTokens] = useState<string>('');

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.amountUsd, 0);
  const totalInferenceCost = (totalTokensCount / 1_000_000) * 0.75 + 42.85;
  const grossProfit = Math.max(0, totalRevenue - totalInferenceCost);
  const profitMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const handleCreateInvoice = () => {
    if (!newClient.trim() || !newAmount) return;
    const amount = parseFloat(newAmount) || 500;
    const tokens = parseInt(newTokens) || 2000000;
    const estimatedCost = (tokens / 1_000_000) * 0.75;

    const newInv: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newClient.trim(),
      period: 'Outubro 2026',
      tokensBilled: tokens,
      amountUsd: amount,
      marginProfitUsd: Math.max(0, amount - estimatedCost),
      status: 'pending',
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    };

    onAddInvoice(newInv);
    setIsInvoiceModalOpen(false);
    setNewClient('');
    setNewAmount('');
    setNewTokens('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
            Gestão Financeira & Monetização
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
            {t.titleFinanceDashboard}
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1">
            Controle analítico de despesas de inferência por token, markups de revenda e faturamento corporativo.
          </p>
        </div>

        <Tooltip content={t.tooltipEmitInvoice} position="left">
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.actionEmitInvoice}</span>
          </button>
        </Tooltip>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span>Faturamento Bruto</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--theme-text)]">
            ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% este mês
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span>Custo Real de Inferência</span>
            <Receipt className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            ${totalInferenceCost.toFixed(2)}
          </div>
          <div className="text-[11px] text-[var(--theme-text-muted)] font-mono">
            {totalTokensCount.toLocaleString('pt-BR')} tokens consumidos
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span>Lucro Operacional Bruto</span>
            <TrendingUp className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--theme-accent)]">
            ${grossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Margem: {profitMarginPercent.toFixed(1)}%
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span>Markup de Revenda</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--theme-text)]">
            +{markupPercent}%
          </div>
          <div className="text-[11px] text-[var(--theme-text-muted)]">
            Margem aplicada sobre custo base
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--theme-text)]">
            Distribuição de Custos por Provedor de Modelo
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs text-[var(--theme-text)] mb-1">
                <span>Google Gemini (3.8 Flash & 4 Argon)</span>
                <span className="font-mono text-[var(--theme-accent)]">$24.30 (56.7%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--theme-surface-subtle)] overflow-hidden">
                <div className="h-full bg-[var(--theme-accent)] rounded-full" style={{ width: '56.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[var(--theme-text)] mb-1">
                <span>Anthropic Claude 3.5 Sonnet</span>
                <span className="font-mono text-amber-400">$12.50 (29.2%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--theme-surface-subtle)] overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '29.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[var(--theme-text)] mb-1">
                <span>OpenAI GPT-4o / Codex</span>
                <span className="font-mono text-emerald-400">$6.05 (14.1%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--theme-surface-subtle)] overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '14.1%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--theme-text)]">
            Configurador de Margem e Precificação
          </h3>

          <div>
            <div className="flex justify-between text-xs text-[var(--theme-text-muted)] mb-1.5">
              <span>Markup Operacional:</span>
              <span className="font-mono font-bold text-[var(--theme-accent)]">+{markupPercent}%</span>
            </div>
            <Tooltip content="Ajuste a porcentagem de margem adicionada ao custo de inferência ao faturar clientes" position="top" className="w-full">
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(parseInt(e.target.value))}
                className="w-full accent-[var(--theme-accent)]"
              />
            </Tooltip>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] space-y-1">
            <div className="font-semibold text-[var(--theme-text)]">Exemplo de Faturamento:</div>
            <div>Custo de 1M tokens: <strong className="text-[var(--theme-text)]">$0.60 USD</strong></div>
            <div>Preço faturado ao cliente: <strong className="text-emerald-400 font-mono">${(0.6 * (1 + markupPercent / 100)).toFixed(2)} USD</strong></div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
          <h3 className="text-sm font-bold text-[var(--theme-text)]">
            {t.titleInvoicesTable} ({invoices.length})
          </h3>
          <span className="text-xs font-mono text-[var(--theme-text-muted)]">
            Total: ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[var(--theme-border)] text-[var(--theme-text-muted)] font-mono text-[11px]">
                <th className="py-2.5 px-3">Fatura</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Período</th>
                <th className="py-2.5 px-3 text-right">Tokens Faturados</th>
                <th className="py-2.5 px-3 text-right">Valor Bruto</th>
                <th className="py-2.5 px-3 text-right">Lucro Estimado</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--theme-surface-subtle)] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[var(--theme-accent)]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--theme-text)]">
                    {inv.clientName}
                  </td>
                  <td className="py-3 px-3 text-[var(--theme-text-muted)]">
                    {inv.period}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[var(--theme-text)]">
                    {inv.tokensBilled.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[var(--theme-text)]">
                    ${inv.amountUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400">
                    +${inv.marginProfitUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inv.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              {t.actionEmitInvoice}
            </h3>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Nome do Cliente / Organização
              </label>
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="Ex: Banco Horizonte S.A."
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Tokens Consumidos
              </label>
              <input
                type="number"
                value={newTokens}
                onChange={(e) => setNewTokens(e.target.value)}
                placeholder="Ex: 5000000"
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Valor Total (USD)
              </label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Ex: 850.00"
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={!newClient.trim() || !newAmount}
                className="px-4 py-1.5 rounded-md bg-[var(--theme-accent)] text-slate-950 font-bold text-xs disabled:opacity-50 cursor-pointer"
              >
                Gerar Fatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
