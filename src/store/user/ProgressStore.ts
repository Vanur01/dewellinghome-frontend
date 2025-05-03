import { create } from 'zustand';
import { progressApi } from '../../utils/api';
import { AxiosError } from 'axios';

export interface ProgressEntry {
  _id: string;
  projectId: string;
  date: string;
  title: string;
  description: string;
  images: string[];
  completionPercentage: number;
  postedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProgressPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface UserProgressState {
  progressEntries: ProgressEntry[];
  loading: boolean;
  error: string | null;
  pagination: ProgressPagination;

  // Actions
  fetchProjectProgress: (projectId: string, page?: number, limit?: number) => Promise<void>;
  reset: () => void;
}

export const useUserProgressStore = create<UserProgressState>((set) => ({
  progressEntries: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  },

  fetchProjectProgress: async (projectId, page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      const response = await progressApi.getProjectProgress(projectId, { page, limit });
      
      set({
        progressEntries: response.data.data.progress,
        pagination: response.data.data.pagination,
        loading: false
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch progress entries',
        loading: false 
      });
    }
  },

  reset: () => {
    set({
      progressEntries: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10
      }
    });
  }
}));
