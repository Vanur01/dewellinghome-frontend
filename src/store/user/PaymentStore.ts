import { create } from 'zustand';
import { PaymentSchedule, paymentApi } from '@/utils/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// Extended type for populated project
interface PopulatedPaymentSchedule extends Omit<PaymentSchedule, 'projectId'> {
  projectId: {
    _id: string;
    title: string;
    clientId: string;
    status: string;
    startDate: string;
    estimatedEndDate: string;
  };
  currentMilestone: number;
}

interface PaymentStore {
  // State
  currentSchedule: PopulatedPaymentSchedule | null;
  userSchedules: PopulatedPaymentSchedule[];
  loading: boolean;
  error: string | null;

  // Actions
  getPaymentScheduleByProject: (projectId: string) => Promise<void>;
  getUserPaymentSchedules: () => Promise<void>;
  clearSchedule: () => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  // Initial state
  currentSchedule: null,
  userSchedules: [],
  loading: false,
  error: null,

  // Actions
  getPaymentScheduleByProject: async (projectId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await paymentApi.getPaymentScheduleByProjectId(projectId);
      set({ currentSchedule: response.data.data as unknown as PopulatedPaymentSchedule });
    } catch (error) {
      const message = error instanceof AxiosError 
        ? error.response?.data?.message 
        : 'Failed to fetch payment schedule';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  getUserPaymentSchedules: async () => {
    try {
      set({ loading: true, error: null });
      const response = await paymentApi.getUserPaymentSchedules();
      set({ userSchedules: response.data.data as unknown as PopulatedPaymentSchedule[] });
    } catch (error) {
      const message = error instanceof AxiosError 
        ? error.response?.data?.message 
        : 'Failed to fetch payment schedules';
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  clearSchedule: () => {
    set({ currentSchedule: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
