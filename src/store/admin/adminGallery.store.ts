import { create } from 'zustand';
import { galleryApi } from '../../utils/api';
import { AxiosError } from 'axios';

interface Image {
  url: string;
  _id?: string;
}

export interface Design {
  _id: string;
  title: string;
  description: string;
  images: Image[];
  gallery: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Gallery {
  _id: string;
  title: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  message: string;
}

interface AdminGalleryState {
  galleries: Gallery[];
  designs: { [galleryId: string]: Design[] };
  loading: boolean;
  error: string | null;
  selectedGallery: Gallery | null;
  selectedDesign: Design | null;

  // Gallery Actions
  fetchGalleries: () => Promise<void>;
  createGallery: (data: { title: string; category: string; description: string }) => Promise<void>;
  updateGallery: (galleryId: string, data: { title?: string; category?: string; description?: string }) => Promise<void>;
  deleteGallery: (galleryId: string) => Promise<void>;
  setSelectedGallery: (gallery: Gallery | null) => void;

  // Design Actions
  fetchDesigns: (galleryId: string) => Promise<void>;
  addDesign: (galleryId: string, formData: FormData) => Promise<void>;
  updateDesign: (galleryId: string, designId: string, formData: FormData) => Promise<void>;
  deleteDesign: (galleryId: string, designId: string) => Promise<void>;
  setSelectedDesign: (design: Design | null) => void;
}

export const useAdminGalleryStore = create<AdminGalleryState>((set) => ({
  galleries: [],
  designs: {},
  loading: false,
  error: null,
  selectedGallery: null,
  selectedDesign: null,

  // Gallery Actions
  fetchGalleries: async () => {
    try {
      set({ loading: true, error: null });
      const response = await galleryApi.getAllGalleries();
      set({ galleries: response.data.data, loading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch galleries', 
        loading: false 
      });
    }
  },

  createGallery: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await galleryApi.createGallery(data);
      set(state => ({
        galleries: [...state.galleries, response.data.data],
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to create gallery', 
        loading: false 
      });
    }
  },

  updateGallery: async (galleryId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await galleryApi.updateGallery(galleryId, data);
      set(state => ({
        galleries: state.galleries.map(gallery =>
          gallery._id === galleryId ? response.data.data : gallery
        ),
        selectedGallery: response.data.data,
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to update gallery', 
        loading: false 
      });
    }
  },

  deleteGallery: async (galleryId) => {
    try {
      set({ loading: true, error: null });
      await galleryApi.deleteGallery(galleryId);
      set(state => ({
        galleries: state.galleries.filter(gallery => gallery._id !== galleryId),
        designs: { ...state.designs, [galleryId]: undefined },
        selectedGallery: null,
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to delete gallery', 
        loading: false 
      });
    }
  },

  setSelectedGallery: (gallery) => {
    set({ selectedGallery: gallery });
  },

  // Design Actions
  fetchDesigns: async (galleryId) => {
    try {
      set({ loading: true, error: null });
      const response = await galleryApi.getDesignsByGalleryId(galleryId);
      set(state => ({
        designs: { 
          ...state.designs, 
          [galleryId]: response.data.data 
        },
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to fetch designs', 
        loading: false 
      });
    }
  },

  addDesign: async (galleryId, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await galleryApi.addDesignToGallery(galleryId, formData);
      set(state => ({
        designs: {
          ...state.designs,
          [galleryId]: [...(state.designs[galleryId] || []), response.data.data]
        },
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to add design', 
        loading: false 
      });
    }
  },

  updateDesign: async (galleryId, designId, formData) => {
    try {
      set({ loading: true, error: null });
      const response = await galleryApi.updateDesign(galleryId, designId, formData);
      set(state => ({
        designs: {
          ...state.designs,
          [galleryId]: state.designs[galleryId]?.map(design =>
            design._id === designId ? response.data.data : design
          ) || []
        },
        selectedDesign: response.data.data,
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to update design', 
        loading: false 
      });
    }
  },

  deleteDesign: async (galleryId, designId) => {
    try {
      set({ loading: true, error: null });
      await galleryApi.deleteDesign(galleryId, designId);
      set(state => ({
        designs: {
          ...state.designs,
          [galleryId]: state.designs[galleryId]?.filter(
            design => design._id !== designId
          ) || []
        },
        selectedDesign: null,
        loading: false
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      set({ 
        error: axiosError.response?.data?.message || 'Failed to delete design', 
        loading: false 
      });
    }
  },

  setSelectedDesign: (design) => {
    set({ selectedDesign: design });
  },
}));
