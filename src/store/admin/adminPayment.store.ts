import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '@/utils/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface PaymentMilestone {
  _id: string;
  slNo: number;
  timeline: string;
  percentage: number;
  amount: number;
  actualPaid: number;
  effectivePaid: number;
  overpayment: number;
  toBePaid: number;
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  status: 'pending' | 'partially_paid' | 'paid';
}

interface Project {
  _id: string;
  title: string;
  clientId: {
    _id: string;
    name: string;
  };
}

export interface PaymentSchedule {
  _id: string;
  projectId: Project;
  totalProjectValue: number;
  milestones: PaymentMilestone[];
  totalPaid: number;
  totalRemaining: number;
  totalOverpayment: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminPaymentState {
  paymentSchedules: PaymentSchedule[];
  currentSchedule: PaymentSchedule | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchAllSchedules: () => Promise<void>;
  fetchScheduleById: (id: string) => Promise<void>;
  createSchedule: (data: {
    projectId: string;
    totalProjectValue: number;
    milestones: Array<{ timeline: string; percentage: number }>;
  }) => Promise<PaymentSchedule>;
  updateProjectValue: (id: string, totalProjectValue: number) => Promise<PaymentSchedule>;
  updatePaymentStructure: (
    id: string,
    milestones: Array<{ timeline: string; percentage: number }>
  ) => Promise<PaymentSchedule>;
  updateMilestonePayment: (
    scheduleId: string,
    milestoneId: string,
    data: {
      amount: number;
      paymentMethod?: string;
      paymentReference?: string;
    }
  ) => Promise<PaymentSchedule>;
  resetStore: () => void;
}

export const useAdminPaymentStore = create<AdminPaymentState>()(
  devtools(
    (set) => ({
      // Initial state
      paymentSchedules: [],
      currentSchedule: null,
      loading: false,
      error: null,

      // Actions
      fetchAllSchedules: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/payments');
          set({ paymentSchedules: response.data.data });
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to fetch payment schedules');
        } finally {
          set({ loading: false });
        }
      },

      fetchScheduleById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/payments/${id}`);
          set({ currentSchedule: response.data.data });
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to fetch payment schedule');
        } finally {
          set({ loading: false });
        }
      },

      createSchedule: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/payments', data);
          const newSchedule = response.data.data;
          set((state) => ({
            paymentSchedules: [...state.paymentSchedules, newSchedule],
            currentSchedule: newSchedule
          }));
          toast.success('Payment schedule created successfully');
          return newSchedule;
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to create payment schedule');
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      updateProjectValue: async (id: string, totalProjectValue: number) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put(`/payments/${id}/project-value`, {
            totalProjectValue
          });
          const updatedSchedule = response.data.data;
          set((state) => ({
            paymentSchedules: state.paymentSchedules.map((schedule) =>
              schedule._id === id ? updatedSchedule : schedule
            ),
            currentSchedule: updatedSchedule
          }));
          toast.success('Project value updated successfully');
          return updatedSchedule;
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to update project value');
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      updatePaymentStructure: async (id: string, milestones) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put(`/payments/${id}/structure`, { milestones });
          const updatedSchedule = response.data.data;
          set((state) => ({
            paymentSchedules: state.paymentSchedules.map((schedule) =>
              schedule._id === id ? updatedSchedule : schedule
            ),
            currentSchedule: updatedSchedule
          }));
          toast.success('Payment structure updated successfully');
          return updatedSchedule;
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to update payment structure');
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      updateMilestonePayment: async (scheduleId, milestoneId, data) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put(
            `/payments/${scheduleId}/milestone/${milestoneId}`,
            data
          );
          const updatedSchedule = response.data.data;
          set((state) => ({
            paymentSchedules: state.paymentSchedules.map((schedule) =>
              schedule._id === scheduleId ? updatedSchedule : schedule
            ),
            currentSchedule: updatedSchedule
          }));
          toast.success('Payment recorded successfully');
          return updatedSchedule;
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to record payment');
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      resetStore: () => {
        set({
          paymentSchedules: [],
          currentSchedule: null,
          error: null
        });
      }
    }),
    {
      name: 'admin-payment-store'
    }
  )
);
