import { create } from 'zustand';
import { projectApi } from '../../utils/api';
import { AxiosError, AxiosResponse } from 'axios';

export interface ProjectItem {
  _id: string;
  category: string;
  name: string;
  units: number;
  size: string;
  materials: string;
  notes?: string;
}

export interface Project {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  title: string;
  location: string;
  status: 'planning' | 'designing' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  estimatedEndDate: string;
  budget: number;
  notes?: string;
  items: ProjectItem[];
  gallery: string[];
  dailyProgress?: {
    _id: string;
    date: string;
    title: string;
    description: string;
    images: string[];
    completionPercentage: number;
    postedBy: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  clientId: string;
  title: string;
  location: string;
  status: Project['status'];
  startDate: Date;
  estimatedEndDate: Date;
  budget: number;
  notes?: string;
  items: Omit<ProjectItem, '_id'>[];
  gallery: string[];
}

// Add a new type for form data
export type CreateProjectFormData = FormData;

// UpdateProjectData allows partial updates of project fields
export type UpdateProjectData = Partial<CreateProjectData> & {
  existingImages?: string[];
};

// Add FormData to allowed types for project updates
export type ProjectUpdatePayload = UpdateProjectData | FormData;

export interface ProjectFilters {
  status?: Project['status'];
  search?: string;
}

// Add new interface for search results
export interface ProjectSearchResult {
  _id: string;
  title: string;
  location: string;
  status: string;
  startDate: string;
  estimatedEndDate: string;
  client: {
    name: string;
  };
}

interface ApiErrorResponse {
  message: string;
}

interface ProjectState {
  projects: Project[];
  searchResults: ProjectSearchResult[];
  currentProject: Project | null;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
  filters: ProjectFilters;

  // Actions
  setFilters: (filters: ProjectFilters) => void;
  fetchProjects: (page?: number) => Promise<void>;
  searchProjects: (query: string) => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  createProject: (projectData: CreateProjectData | CreateProjectFormData) => Promise<AxiosResponse>;
  updateProject: (id: string, projectData: ProjectUpdatePayload) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addProjectItem: (projectId: string, item: Omit<ProjectItem, '_id'>) => Promise<void>;
  removeProjectItem: (projectId: string, itemId: string) => Promise<void>;
  reset: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  searchResults: [],
  currentProject: null,
  loading: false,
  searchLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  },
  filters: {},

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchProjects(1);
  },

  searchProjects: async (query) => {
    try {
      set({ searchLoading: true, error: null });
      const response = await projectApi.searchProjects(query);
      set({
        searchResults: response.data,
        searchLoading: false
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to search projects',
        searchLoading: false
      });
    }
  },

  fetchProjects: async (page = 1) => {
    try {
      set({ loading: true, error: null });
      const response = await projectApi.getProjects({
        page,
        limit: get().pagination.limit,
        ...get().filters
      });
      
      set({
        projects: response.data.projects,
        pagination: response.data.pagination,
        loading: false
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch projects',
        loading: false 
      });
    }
  },

  fetchProjectById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await projectApi.getProjectById(id);
      const project = response.data;
      set({ currentProject: project, loading: false });
      return project;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.message || 'Failed to fetch project',
        loading: false
      });
      return null;
    }
  },

  createProject: async (projectData) => {
    try {
      set({ loading: true, error: null });
      const response = await projectApi.createProject(projectData);
      await get().fetchProjects();
      set({ loading: false });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.message || 'Failed to create project',
        loading: false
      });
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      set({ loading: true, error: null });
      await projectApi.updateProject(id, projectData);
      
      await Promise.all([
        get().fetchProjects(),
        get().currentProject?._id === id ? get().fetchProjectById(id) : Promise.resolve()
      ]);
      
      set({ loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.message || 'Failed to update project',
        loading: false
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      set({ loading: true, error: null });
      await projectApi.deleteProject(id);
      await get().fetchProjects();
      set({ loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.message || 'Failed to delete project',
        loading: false
      });
      throw error;
    }
  },

  addProjectItem: async (projectId, item) => {
    try {
      set({ loading: true, error: null });
      await projectApi.addProjectItem(projectId, item);
      await get().fetchProjectById(projectId);
      set({ loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.message || 'Failed to add project item',
        loading: false
      });
      throw error;
    }
  },

  removeProjectItem: async (projectId, itemId) => {
    try {
      set({ loading: true, error: null });
      await projectApi.removeProjectItem(projectId, itemId);
      await get().fetchProjectById(projectId);
      set({ loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      set({
        error: axiosError.response?.data?.message || 'Failed to remove project item',
        loading: false
      });
      throw error;
    }
  },

  reset: () => {
    set({
      projects: [],
      searchResults: [],
      currentProject: null,
      loading: false,
      searchLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10
      },
      filters: {}
    });
  }
})); 