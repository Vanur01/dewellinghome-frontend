import { create } from 'zustand';
import { publicGalleryApi, Gallery, Design } from '../../utils/publicApi';
import { AxiosError } from 'axios';

interface GalleryState {
  galleries: Gallery[];
  galleryDesigns: { [galleryId: string]: Design[] };
  currentDesign: Design | null;
  loading: boolean;
  error: string | null;
  
  // Public Actions
  getAllGalleries: () => Promise<void>;
  getGalleryByCategory: (category: string) => Promise<void>;
  getDesignsByGalleryId: (galleryId: string) => Promise<void>;
  getSpecificDesign: (galleryId: string, designId: string) => Promise<void>;
}

const useGalleryStore = create<GalleryState>((set) => ({
  galleries: [],
  galleryDesigns: {},
  currentDesign: null,
  loading: false,
  error: null,

  getAllGalleries: async () => {
    try {
      set({ loading: true, error: null });
      const response = await publicGalleryApi.getAllGalleries();
      set({ galleries: response.data.data, loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch galleries', 
        loading: false 
      });
    }
  },

  getGalleryByCategory: async (category: string) => {
    try {
      set({ loading: true, error: null });
      const response = await publicGalleryApi.getGalleryByCategory(category);
      set({ galleries: response.data.data, loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch galleries by category', 
        loading: false 
      });
    }
  },

  getDesignsByGalleryId: async (galleryId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await publicGalleryApi.getDesignsByGalleryId(galleryId);
      set(state => ({ 
        galleryDesigns: {
          ...state.galleryDesigns,
          [galleryId]: response.data.data,
        },
        loading: false 
      }
    ))
    console.log(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch designs', 
        loading: false 
      });
    }
  },

  getSpecificDesign: async (galleryId: string, designId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await publicGalleryApi.getSpecificDesign(galleryId, designId);
      set({ currentDesign: response.data.data, loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch design', 
        loading: false 
      });
    }
  },
}));

export default useGalleryStore;
