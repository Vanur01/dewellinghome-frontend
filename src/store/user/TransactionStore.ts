import { create } from 'zustand';
import { Transaction, transactionApi } from '../../utils/api';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  
  // Actions
  getUserTransactions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => Promise<void>;
  
  reset: () => void;
}

export const useUserTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,

  getUserTransactions: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await transactionApi.getUserTransactions(params);
      const data = response.data.data;
      set({
        transactions: data.transactions,
        total: data.pagination.totalTransactions,
        page: data.pagination.currentPage,
        limit: data.pagination.limit,
        totalPages: data.pagination.totalPages
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch transactions' });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      transactions: [],
      isLoading: false,
      error: null,
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    });
  }
}));