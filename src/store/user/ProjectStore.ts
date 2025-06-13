import { create } from 'zustand';
import { projectApi } from '../../utils/api';

interface Project {
  _id: string;
  title: string;
  location: string;
  status: 'planning' | 'designing' | 'in_progress' | 'completed' | 'on_hold';
  startDate: Date;
  estimatedEndDate: Date;
  paymentSchedule: string;
  budget: number;
  notes?: string;
  items?: Array<{
    _id: string;
    category: string;
    name: string;
    units: number;
    size: string;
    materials: string;
    notes?: string;
  }>;
  gallery?: string[];
  clientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserProjects: (params?: {
    page?: number;
    limit?: number;
    status?: Project['status'];
    search?: string;
  }) => Promise<void>;
  
  fetchProjectById: (id: string) => Promise<void>;
  clearProjects: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  totalPages: 0,
  currentPage: 1,
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchUserProjects: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await projectApi.getUserProjects( params);
      set({
        projects: response.data.projects,
        totalPages: response.data.pagination.totalPages,
        currentPage: response.data.pagination.currentPage,
        totalItems: response.data.pagination.totalItems,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        isLoading: false
      });
    }
  },

  fetchProjectById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await projectApi.getProjectById(id);
      set({ 
        currentProject: response.data,
        isLoading: false 
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch project',
        isLoading: false
      });
    }
  },

  clearProjects: () => {
    set({
      projects: [],
      currentProject: null,
      totalPages: 0,
      currentPage: 1,
      totalItems: 0
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));
