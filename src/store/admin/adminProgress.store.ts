import { create } from 'zustand';
import { progressApi } from '../../utils/api';
import { AxiosError, AxiosResponse } from 'axios';

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

interface ProgressState {
  progressEntries: ProgressEntry[];
  currentProgress: ProgressEntry | null;
  loading: boolean;
  error: string | null;
  pagination: ProgressPagination;

  // Actions
  fetchProjectProgress: (projectId: string, page?: number, limit?: number) => Promise<void>;
  fetchProgressById: (id: string) => Promise<void>;
  createProgress: (projectId: string, data: FormData) => Promise<AxiosResponse>;
  updateProgress: (id: string, data: FormData) => Promise<AxiosResponse>;
  deleteProgress: (id: string) => Promise<void>;
  refreshProjectProgress: (projectId: string) => Promise<void>;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressEntries: [],
  currentProgress: null,
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

  fetchProgressById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await progressApi.getProgressById(id);
      set({ currentProgress: response.data, loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message || 'Failed to fetch progress entry',
        loading: false
      });
    }
  },

  createProgress: async (projectId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await progressApi.createProgress(data);
      await get().fetchProjectProgress(projectId);
      set({ loading: false });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message || 'Failed to create progress entry',
        loading: false
      });
      throw error;
    }
  },

  updateProgress: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const response = await progressApi.updateProgress(id, data);
      
      // Update the current progress entry
      await get().fetchProgressById(id);
      
      // Update the progress entry in the list
      set(state => ({
        progressEntries: state.progressEntries.map(entry => 
          entry._id === id ? { ...entry, ...response.data.data } : entry
        ),
        loading: false
      }));
      
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message || 'Failed to update progress entry',
        loading: false
      });
      throw error;
    }
  },

  refreshProjectProgress: async (projectId) => {
    try {
      const { currentPage, limit } = get().pagination;
      await get().fetchProjectProgress(projectId, currentPage, limit);
    } catch (error) {
      console.error('Error refreshing project progress:', error);
    }
  },

  deleteProgress: async (id) => {
    try {
      set({ loading: true, error: null });
      await progressApi.deleteProgress(id);
      
      // Remove the deleted progress entry from the state
      set(state => ({
        progressEntries: state.progressEntries.filter(entry => entry._id !== id),
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message || 'Failed to delete progress entry',
        loading: false
      });
      throw error;
    }
  },

  reset: () => {
    set({
      progressEntries: [],
      currentProgress: null,
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
