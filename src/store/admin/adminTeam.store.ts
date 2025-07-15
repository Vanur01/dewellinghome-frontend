import { create } from 'zustand';
import { teamApi } from '../../utils/api';

export interface Social {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface LeadershipMember {
  name: string;
  position: string;
  image: string;
  bio: string;
  social?: Social;
}

export interface Employee {
  name: string;
  position: string;
  image: string;
}

export interface Team {
  leadership: LeadershipMember[];
  employees: Employee[];
  _id?: string;
}

interface AdminTeamState {
  team: Team | null;
  loading: boolean;
  error: string | null;
  fetchTeam: () => Promise<void>;
  addLeadershipMember: (formData: FormData) => Promise<void>;
  addEmployee: (formData: FormData) => Promise<void>;
  updateLeadershipMember: (index: number, formData: FormData) => Promise<void>;
  updateEmployee: (index: number, formData: FormData) => Promise<void>;
  deleteLeadershipMember: (index: number) => Promise<void>;
  deleteEmployee: (index: number) => Promise<void>;
}

function getErrorMessage(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: unknown }).response === 'object' &&
    (err as { response?: { data?: { message?: string } } }).response &&
    (err as { response: { data?: { message?: string } } }).response.data &&
    typeof (err as { response: { data: { message?: string } } }).response.data.message === 'string'
  ) {
    return (err as { response: { data: { message: string } } }).response.data.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error';
}

export const useAdminTeamStore = create<AdminTeamState>((set, get) => ({
  team: null,
  loading: false,
  error: null,

  fetchTeam: async () => {
    set({ loading: true, error: null });
    try {
      const res = await teamApi.getTeam();
      set({ team: res.data.data, loading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  addLeadershipMember: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await teamApi.addLeadershipMember(formData);
      set({ team: res.data.data, loading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  addEmployee: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await teamApi.addEmployee(formData);
      set({ team: res.data.data, loading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  updateLeadershipMember: async (index, formData) => {
    set({ loading: true, error: null });
    try {
      await teamApi.updateLeadershipMember(index, formData);
      await get().fetchTeam();
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  updateEmployee: async (index, formData) => {
    set({ loading: true, error: null });
    try {
      await teamApi.updateEmployee(index, formData);
      await get().fetchTeam();
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  deleteLeadershipMember: async (index) => {
    set({ loading: true, error: null });
    try {
      await teamApi.deleteLeadershipMember(index);
      await get().fetchTeam();
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  deleteEmployee: async (index) => {
    set({ loading: true, error: null });
    try {
      await teamApi.deleteEmployee(index);
      await get().fetchTeam();
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
}));
