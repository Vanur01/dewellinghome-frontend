import { create } from 'zustand';
import { userApi } from '../../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface searchParams{
  name?:string,
  email?:string,
  phone?:string
}

interface AdminUsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  searchParams: searchParams
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
  fetchAllUsers: (page?: number, limit?: number, searchParams?: searchParams) => Promise<void>;
  fetchUserById: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createUser: (data: { name: string; email: string; password: string; phone: string; address: string; }) => Promise<void>;
  updateUser: (userId: string, data: { name?: string; email?: string; phone?: string; address?: string; role:"admin"| "client" }) => Promise<void>;
}

export const useAdminUsersStore = create<AdminUsersState>((set, get) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  searchParams:{
    name:'',
    email:'',
    phone:''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  },

  fetchAllUsers: async (page = 1, limit = 10, searchParams = {}) => {
    const currentSearchParams = {...searchParams}
    set({ loading: true, error: null });
    try {
      const response = await userApi.getAllUsers({ page, limit ,
        name: currentSearchParams.name || '',
        phone: currentSearchParams.phone || '',
        email: currentSearchParams.email || ''
      });
      set({ 
        users: response.data.data.users,
        pagination: response.data.data.pagination,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      });
    }
  },

  fetchUserById: async (userId) => {
    set({ error: null });
    try {
      const response = await userApi.getUserById(userId);
      set({ 
        selectedUser: response.data.data.user,
        error: null
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await userApi.deleteUser(userId);
      set((state) => ({
        users: state.users.filter(user => user._id !== userId),
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete user'
      });
    }
  },

  createUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.createUser(data);
      set((state) => ({
        users: [...state.users, response.data.data.user],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to create user'
      });
      throw error;
    }
  },

  updateUser: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await userApi.updateUser(userId, data);
      set((state) => ({
        users: state.users.map(user => 
          user._id === userId ? { ...user, ...response.data.data.user } : user
        ),
        selectedUser: response.data.data.user,
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to update user'
      });
      throw error;
    }
  }
}));