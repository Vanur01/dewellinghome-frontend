import { create } from 'zustand';
import { testimonialApi, Testimonial, CreateTestimonialData } from '../../utils/api';
import { toast } from 'sonner';

interface TestimonialState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  currentTestimonial: Testimonial | null;
  
  // Actions
  fetchTestimonials: () => Promise<void>;
  fetchTestimonialById: (id: string) => Promise<void>;
  createTestimonial: (data: CreateTestimonialData) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<CreateTestimonialData>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  clearCurrentTestimonial: () => void;
}

interface ApiError {
  message: string;
}

export const useAdminTestimonialStore = create<TestimonialState>((set) => ({
  testimonials: [],
  loading: false,
  error: null,
  currentTestimonial: null,

  fetchTestimonials: async () => {
    try {
      set({ loading: true, error: null });
      const response = await testimonialApi.getAllTestimonials();
      set({ testimonials: response.data.data });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message });
      toast.error('Failed to fetch testimonials');
    } finally {
      set({ loading: false });
    }
  },

  fetchTestimonialById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await testimonialApi.getTestimonialById(id);
      set({ currentTestimonial: response.data.data });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message });
      toast.error('Failed to fetch testimonial');
    } finally {
      set({ loading: false });
    }
  },

  createTestimonial: async (data: CreateTestimonialData) => {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      
      // Append all data to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await testimonialApi.createTestimonial(formData);
      set(state => ({
        testimonials: [...state.testimonials, response.data.data]
      }));
      toast.success('Testimonial created successfully');
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message });
      toast.error('Failed to create testimonial');
    } finally {
      set({ loading: false });
    }
  },

  updateTestimonial: async (id: string, data: Partial<CreateTestimonialData>) => {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      
      // Append all data to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await testimonialApi.updateTestimonial(id, formData);
      set(state => ({
        testimonials: state.testimonials.map(t => 
          t._id === id ? response.data.data : t
        ),
        currentTestimonial: response.data.data
      }));
      toast.success('Testimonial updated successfully');
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message });
      toast.error('Failed to update testimonial');
    } finally {
      set({ loading: false });
    }
  },

  deleteTestimonial: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await testimonialApi.deleteTestimonial(id);
      set(state => ({
        testimonials: state.testimonials.filter(t => t._id !== id)
      }));
      toast.success('Testimonial deleted successfully');
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message });
      toast.error('Failed to delete testimonial');
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentTestimonial: () => {
    set({ currentTestimonial: null });
  },
}));
