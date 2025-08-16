import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { paymentScheduleApi, PaymentMilestone as ApiPaymentMilestone, PaymentSchedule } from '@/utils/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

// Remove duplicate PaymentMilestone interface since we're importing it
export type { ApiPaymentMilestone as PaymentMilestone };

// Remove duplicate PaymentSchedule interface since we're importing it
export type { PaymentSchedule };

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
    milestones: Array<{ timeline: string; percentage: number; actualPaid?: number }>;
  }) => Promise<PaymentSchedule>;
  updateProjectValue: (id: string, totalProjectValue: number) => Promise<PaymentSchedule>;
  updatePaymentStructure: (
    id: string,
    milestones: Array<{ timeline: string; percentage: number; actualPaid?: number }>
  ) => Promise<PaymentSchedule>;
  updateCurrentMilestone: (id: string, currentMilestone: number) => Promise<PaymentSchedule>;
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
          const response = await paymentScheduleApi.getAllPaymentSchedules();
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
          const response = await paymentScheduleApi. getPaymentScheduleByProjectId(id);
          set({ currentSchedule: response.data.data });
        } catch (err) {
          const error = err as AxiosError;
          set({ currentSchedule:null ,error: error.message });
          toast.error('Failed to fetch payment schedule');
        } finally {
          set({ loading: false });
        }
      },

      createSchedule: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentScheduleApi.createPaymentSchedule(data);
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
          const response = await paymentScheduleApi.updateProjectValue(id, totalProjectValue);
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
          const response = await paymentScheduleApi.updatePaymentStructure(id, milestones);
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

      updateCurrentMilestone: async (id: string, currentMilestone: number) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentScheduleApi.updateCurrentMilestone(id, currentMilestone);
          const updatedSchedule = response.data.data;
          set((state) => ({
            paymentSchedules: state.paymentSchedules.map((schedule) =>
              schedule._id === id ? updatedSchedule : schedule
            ),
            currentSchedule: updatedSchedule
          }));
          toast.success('Current milestone updated successfully');
          return updatedSchedule;
        } catch (err) {
          const error = err as AxiosError;
          set({ error: error.message });
          toast.error('Failed to update current milestone');
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
