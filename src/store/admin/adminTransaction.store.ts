import { create } from 'zustand';
import { transactionApi, Transaction } from '../../utils/api';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  limit: number;
}

interface AdminTransactionState {
  transactions: Transaction[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;
  isViewModalOpen: boolean;

  // Actions
  getAllTransactions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentId?: string;
    orderId?: string;
  }) => Promise<void>;
  getTransactionById: (id: string) => Promise<void>;
  clearSelectedTransaction: () => void;
  clearError: () => void;
}

export const useAdminTransactionStore = create<AdminTransactionState>((set,get) => ({
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

  getAllTransactions: async (params) => {
    try {
      set({ loading: true, error: null });
      const response = await transactionApi.getAllTransactions(params);
      const data = response.data.data;
      set({
        transactions: data?.transactions || [], // Add null check and default to empty array
        pagination: data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalTransactions: 0,
          limit: 10
        },
        loading: false,
      });
      console.log('Fetched transactions:', get().transactions);
    } catch (error) {
      set({
        transactions: [], // Reset to empty array on error
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
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
        isViewModalOpen: true, // Add this line to open modal
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