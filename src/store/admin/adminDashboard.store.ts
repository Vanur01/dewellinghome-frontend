import { create } from 'zustand';
import { dashboardApi } from '../../utils/api';

interface DashboardOverviewData {
  revenue: {
    total: number;
    thisMonth: number;
    outstanding: number;
    trend: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    planning: number;
    designing:number;
    onHold: number;
  };
  inquiries: {
    total: number;
    new: number;
    converted: number;
    pending: number;
  };
  customers: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  testimonials: {
    total: number;
    pending: number;
    averageRating: number;
  };
  warranty: {
    total: number;
    pending: number;
    resolved: number;
  };
}

interface AdminDashboardStore {
  data: DashboardOverviewData | null;
  loading: boolean;
  error: string | null;
  fetchDashboardOverview: (force?: boolean) => Promise<void>;
  resetDashboardOverview: () => Promise<void>;
  hasFetched: boolean;
}

export const useAdminDashboardStore = create<AdminDashboardStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  hasFetched: false,
  fetchDashboardOverview: async (force = false) => {
    if (get().hasFetched && !force) return;
    set({ loading: true, error: null });
    try {
      const res = await dashboardApi.getOverview();
      set({ data: res.data.data, loading: false, hasFetched: true });
    } catch (err: unknown) {
      let errorMsg = 'Failed to fetch dashboard data';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message?: string }).message!;
      }
      set({ error: errorMsg, loading: false });
    }
  },
  resetDashboardOverview: async () => {
    set({ hasFetched: false });
    await get().fetchDashboardOverview(true);
  },
}));
