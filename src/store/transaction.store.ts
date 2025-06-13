import { create } from 'zustand';
import { Transaction, transactionApi } from '../utils/api';

interface TransactionState {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
  };
  loading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;
  isViewModalOpen: boolean;

  // Actions
  getProjectTransactions: (projectId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => Promise<void>;
  getTransactionById: (id: string) => Promise<void>;
  clearSelectedTransaction: () => void;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
    limit: 10,
  },
  loading: false,
  error: null,
  selectedTransaction: null,
  isViewModalOpen: false,

  getProjectTransactions: async (projectId, params) => {
    try {
      set({ loading: true, error: null });
      const response = await transactionApi.getProjectTransactions(projectId, params);
      const data = response.data.data;
      set({
        transactions: data?.transactions || [],
        pagination: data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalTransactions: 0,
          limit: 10
        },
        loading: false,
      });
    } catch (error) {
      set({
        transactions: [],
        error: error instanceof Error ? error.message : 'Failed to fetch project transactions',
        loading: false,
      });
    }
  },

  getTransactionById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await transactionApi.getTransactionById(id);
      set({
        selectedTransaction: response.data.data.transaction,
        isViewModalOpen: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch transaction',
        loading: false,
      });
    }
  },

  clearSelectedTransaction: () => set({ selectedTransaction: null, isViewModalOpen: false }),
  clearError: () => set({ error: null }),
}));