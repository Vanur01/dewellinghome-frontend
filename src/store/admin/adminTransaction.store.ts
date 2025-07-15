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
  setSelectedTransaction: (transaction: Transaction) => void;
  clearSelectedTransaction: () => void;
  clearError: () => void;
  editTransaction: (id: string, amount: number) => Promise<{ transaction: Transaction } | void>;
}

export const useAdminTransactionStore = create<AdminTransactionState>((set) => ({
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
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
        loading: false,
      });
    }
  },

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction, isViewModalOpen: true }),
  clearSelectedTransaction: () => set({ selectedTransaction: null, isViewModalOpen: false }),
  clearError: () => set({ error: null }),

  editTransaction: async (id, amount) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionApi.updateTransaction(id, amount);
      const { transaction } = response.data.data;
      // Update transactions array if present
      set((state) => ({
        transactions: state.transactions.map((txn) =>
          txn._id === transaction._id ? transaction : txn
        ),
        selectedTransaction:
          state.selectedTransaction && state.selectedTransaction._id === transaction._id
            ? transaction
            : state.selectedTransaction,
        loading: false,
      }));
      return { transaction };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update transaction',
        loading: false,
      });
    }
  },
}));