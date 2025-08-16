import { api } from "../utils/axiosInstance";
import { 
  Transaction, 
  CreateManualTransactionData, 
  UpdateTransactionData,
  TransactionSummary 
} from "./types";

export const transactionApi = {
  // Get all transactions (admin only)
  getAllTransactions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    transactionId?: string;
    orderId?: string;
    paymentId?: string;
  }) =>
    api.get<{data:{
      transactions: Transaction[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalTransactions: number;
        limit: number;
     } };
    }>("/transactions", { params }),

  // Get user's transactions
  getUserTransactions: (params?: { 
    page?: number; 
    limit?: number;
    status?: string;
  }) =>
    api.get<{
      data: {
        transactions: Transaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalTransactions: number;
          limit: number;
        };
      };
    }>("/transactions/my-transactions", { params }),

  // Get transaction by ID
  getTransactionById: (id: string) =>
    api.get<{data:{ transaction: Transaction }}>(`/transactions/${id}`),

  // Create manual transaction (admin only)
  createManualTransaction: (data: CreateManualTransactionData) =>
    api.post<{ data: { transaction: Transaction } }>(
      "/transactions/manual",
      data
    ),

  // Update a manual transaction (admin only)
  updateTransaction: (id: string, data: UpdateTransactionData) =>
    api.put<{ data: { transaction: Transaction } }>(
      `/transactions/${id}`,
      data
    ),

  // Delete transaction (admin only)
  deleteTransaction: (id: string) =>
    api.delete<{ data: null; message: string }>(`/transactions/${id}`),

  // Get transactions by project ID
  getProjectTransactions: (projectId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    api.get<{
      data: {
        transactions: Transaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalTransactions: number;
          limit: number;
        };
      };
    }>(`/transactions/project/${projectId}`, { params }),

  // Get project transaction summary
  getProjectTransactionSummary: (projectId: string) =>
    api.get<{
      data: TransactionSummary;
    }>(`/transactions/project/${projectId}/summary`),
};
