import { UserAccount } from '../../../types';

export const USER_CONSTANTS = {
  DEFAULT_FALLBACK_USER: {
    id: 'usr-admin-default',
    name: 'Admin Master',
    email: 'admin@orchestrai.studio',
    role: 'admin',
    status: 'active',
    monthlyBudgetCapUsd: 1000,
    currentMonthSpentUsd: 18.42,
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  } as UserAccount,
} as const;
