import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
} from 'lucide-react';
import { UserAccount, UserRole } from '../../../types';
import { LanguageCode, TRANSLATIONS } from '../../core/constants/translations';
import { Tooltip } from '../../shared/components/Tooltip';

interface UserManagementPanelProps {
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
  onUpdateBudgetCap: (userId: string, newCap: number) => void;
  currentLanguage: LanguageCode;
}

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  users,
  onAddUser,
  onUpdateUserRole,
  onToggleUserStatus,
  onUpdateBudgetCap,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<UserRole>('operator');
  const [inviteBudget, setInviteBudget] = useState<string>('200');

  const handleInviteSubmit = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'active',
      monthlyBudgetCapUsd: parseFloat(inviteBudget) || 200,
      currentMonthSpentUsd: 0.0,
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Nunca acessou',
    };

    onAddUser(newUser);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteBudget('200');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xs">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
            Segurança & Controle de Acesso
          </div>
          <h2 className="text-xl font-bold font-display text-[var(--theme-text)] mt-0.5">
            {t.titleUserDirectory}
          </h2>
          <p className="text-xs text-[var(--theme-text-muted)] mt-1">
            Administre contas corporativas, limites mensais de gastos em inferência e privilégios baseados em funções.
          </p>
        </div>

        <Tooltip content={t.tooltipInviteMember} position="left">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[var(--theme-accent)] hover:opacity-90 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.actionInviteUser}</span>
          </button>
        </Tooltip>
      </div>

      {/* Users Table */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--theme-accent)]" />
            <h3 className="text-sm font-bold text-[var(--theme-text)]">
              Membros Cadastrados ({users.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--theme-text-muted)]">
            {users.filter((u) => u.status === 'active').length} contas ativas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[var(--theme-border)] text-[var(--theme-text-muted)] font-mono text-[11px]">
                <th className="py-2.5 px-3">Membro</th>
                <th className="py-2.5 px-3">Papel RBAC</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Cota Mensal de Inferência</th>
                <th className="py-2.5 px-3">Último Acesso</th>
                <th className="py-2.5 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {users.map((u) => {
                const percentSpent = (u.currentMonthSpentUsd / u.monthlyBudgetCapUsd) * 100;
                return (
                  <tr key={u.id} className="hover:bg-[var(--theme-surface-subtle)] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[var(--theme-text)]">{u.name}</div>
                      <div className="text-[11px] text-[var(--theme-text-muted)]">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <Tooltip content="Altere o papel e os privilégios deste membro" position="top">
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="px-2 py-1 rounded bg-[var(--theme-surface-subtle)] border border-[var(--theme-border)] text-[var(--theme-text)] text-xs font-medium cursor-pointer"
                        >
                          <option value="admin">Admin</option>
                          <option value="architect">Arquiteto de IA</option>
                          <option value="operator">Operador</option>
                          <option value="auditor">Auditor</option>
                          <option value="finance">Financeiro</option>
                        </select>
                      </Tooltip>
                    </td>
                    <td className="py-3 px-3">
                      <Tooltip content="Clique para ativar ou suspender o acesso desta conta" position="top">
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {u.status === 'active' ? 'Ativo' : 'Suspenso'}
                        </button>
                      </Tooltip>
                    </td>
                    <td className="py-3 px-3 w-56">
                      <div className="flex justify-between text-[11px] font-mono text-[var(--theme-text)] mb-1">
                        <span>${u.currentMonthSpentUsd.toFixed(2)}</span>
                        <span className="text-[var(--theme-text-muted)]">
                          Teto: ${u.monthlyBudgetCapUsd.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--theme-surface-subtle)] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percentSpent > 80 ? 'bg-rose-500' : 'bg-[var(--theme-accent)]'
                          }`}
                          style={{ width: `${Math.min(100, percentSpent)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[var(--theme-text-muted)]">
                      {u.lastLoginAt.includes('T')
                        ? new Date(u.lastLoginAt).toLocaleString('pt-BR')
                        : u.lastLoginAt}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Tooltip content={t.tooltipAdjustBudget} position="left">
                        <button
                          onClick={() => {
                            const newLimit = prompt(
                              `Novo teto mensal para ${u.name} (USD):`,
                              u.monthlyBudgetCapUsd.toString()
                            );
                            if (newLimit) {
                              onUpdateBudgetCap(u.id, parseFloat(newLimit) || 100);
                            }
                          }}
                          className="text-xs text-[var(--theme-accent)] hover:underline cursor-pointer"
                        >
                          {t.actionAdjustBudget}
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Reference */}
      <div className="p-5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-4">
        <h3 className="text-sm font-bold text-[var(--theme-text)] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--theme-accent)]" />
          <span>Matriz de Privilégios por Função (RBAC)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-1.5">
            <div className="font-bold text-[var(--theme-accent)]">Admin</div>
            <p className="text-[11px] text-[var(--theme-text-muted)]">
              Controle total de permissões, convite de membros, alteração de limites financeiros e exclusão de nós.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-1.5">
            <div className="font-bold text-amber-400">Arquiteto de IA</div>
            <p className="text-[11px] text-[var(--theme-text-muted)]">
              Criação e edição de agentes no canvas visual, conexão de ferramentas, teste de prévias e evals.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-1.5">
            <div className="font-bold text-emerald-400">Operador</div>
            <p className="text-[11px] text-[var(--theme-text-muted)]">
              Execução de missões ativas, envio de comandos por voz/texto e consulta de respostas dos agentes.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-1.5">
            <div className="font-bold text-purple-400">Auditor</div>
            <p className="text-[11px] text-[var(--theme-text-muted)]">
              Acesso exclusivo de leitura para auditoria, histórico de chamadas de ferramentas e exportação PDF/CSV.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] space-y-1.5">
            <div className="font-bold text-cyan-400">Financeiro</div>
            <p className="text-[11px] text-[var(--theme-text-muted)]">
              Gestão de despesas de inferência, configuração de markups de vendas e emissão de faturas corporativas.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              {t.actionInviteUser}
            </h3>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Ex: Ana Lúcia Ferreira"
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                E-mail Corporativo
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Ex: ana.lucia@empresa.com"
                className="w-full px-3 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                  Função (RBAC)
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs cursor-pointer"
                >
                  <option value="operator">Operador</option>
                  <option value="architect">Arquiteto de IA</option>
                  <option value="auditor">Auditor</option>
                  <option value="finance">Financeiro</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--theme-text-muted)] block mb-1">
                  Teto Mensal ($ USD)
                </label>
                <input
                  type="number"
                  value={inviteBudget}
                  onChange={(e) => setInviteBudget(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-subtle)] text-[var(--theme-text)] text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleInviteSubmit}
                disabled={!inviteName.trim() || !inviteEmail.trim()}
                className="px-4 py-1.5 rounded-md bg-[var(--theme-accent)] text-slate-950 font-bold text-xs disabled:opacity-50 cursor-pointer"
              >
                Enviar Convite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
