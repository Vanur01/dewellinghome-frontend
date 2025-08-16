import { create } from 'zustand';
import { 
  transactionApi, 
  Transaction, 
  CreateManualTransactionData, 
  UpdateTransactionData,
  TransactionSummary 
} from '../../utils/api';

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
  projectSummary: TransactionSummary | null;

  // Actions
  getAllTransactions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    transactionId?: string;
    orderId?: string;
    paymentId?: string;
  }) => Promise<void>;
  getTransactionById: (id: string) => Promise<Transaction | null>;
  createManualTransaction: (data: CreateManualTransactionData) => Promise<{ transaction: Transaction } | void>;
  updateTransaction: (id: string, data: UpdateTransactionData) => Promise<{ transaction: Transaction } | void>;
  deleteTransaction: (id: string) => Promise<void>;
  getProjectTransactionSummary: (projectId: string) => Promise<void>;
  setSelectedTransaction: (transaction: Transaction) => void;
  clearSelectedTransaction: () => void;
  clearError: () => void;
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
  projectSummary: null,

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

  getTransactionById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await transactionApi.getTransactionById(id);
      const transaction = response.data.data.transaction;
      set({
        selectedTransaction: transaction,
        loading: false,
      });
      return transaction;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch transaction',
        loading: false,
      });
      return null;
    }
  },

  createManualTransaction: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionApi.createManualTransaction(data);
      const { transaction } = response.data.data;
      
      // Add the new transaction to the beginning of the list
      set((state) => ({
        transactions: [transaction, ...state.transactions],
        pagination: {
          ...state.pagination,
          totalTransactions: state.pagination.totalTransactions + 1
        },
        loading: false,
      }));
      
      return { transaction };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create transaction',
        loading: false,
      });
    }
  },

  updateTransaction: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionApi.updateTransaction(id, data);
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

  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await transactionApi.deleteTransaction(id);
      
      // Remove the transaction from the list
      set((state) => ({
        transactions: state.transactions.filter((txn) => txn._id !== id),
        pagination: {
          ...state.pagination,
          totalTransactions: Math.max(0, state.pagination.totalTransactions - 1)
        },
        selectedTransaction: 
          state.selectedTransaction && state.selectedTransaction._id === id 
            ? null 
            : state.selectedTransaction,
        isViewModalOpen: 
          state.selectedTransaction && state.selectedTransaction._id === id 
            ? false 
            : state.isViewModalOpen,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete transaction',
        loading: false,
      });
    }
  },

  getProjectTransactionSummary: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionApi.getProjectTransactionSummary(projectId);
      set({
        projectSummary: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        projectSummary: null,
        error: error instanceof Error ? error.message : 'Failed to fetch project summary',
        loading: false,
      });
    }
  },

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction, isViewModalOpen: true }),
  clearSelectedTransaction: () => set({ selectedTransaction: null, isViewModalOpen: false }),
  clearError: () => set({ error: null }),
}));