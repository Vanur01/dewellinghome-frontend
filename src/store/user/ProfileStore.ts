import { create } from 'zustand';
import { userApi } from '../../utils/api';
import { AxiosError } from 'axios';

interface Profile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
  isUpdating: boolean;
  updateError: string | null;
  profile: Profile | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: string;
    image?: File;
  }) => Promise<void>;
  
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  isLoading: false,
  error: null,
  imageUrl: null,
  isUpdating: false,
  updateError: null,
  profile: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.getProfile();
      const { user } = response.data.data;
      set({ profile: user });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to fetch profile';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdating: true, updateError: null });
    try {
      const formData = new FormData();
      
      // Append text fields if they exist
      if (data.name) formData.append('name', data.name);
      if (data.phone) formData.append('phone', data.phone);
      if (data.address) formData.append('address', data.address);
      
      // Append image if it exists
      if (data.image) formData.append('image', data.image);

      const response = await userApi.updateProfile(formData);
      const { user } = response.data.data;
      
      set({ 
        profile: user,
        imageUrl: user.image || null 
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to update profile';
      set({ updateError: errorMessage });
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  clearError: () => set({ error: null, updateError: null }),
}));
