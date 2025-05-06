import { create } from "zustand";
import { publicTestimonialApi, Testimonial } from "../../utils/publicApi";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface TestimonialsState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchPublishedTestimonials: () => Promise<void>;
}

export const useTestimonialsStore = create<TestimonialsState>((set) => ({
  testimonials: [],
  loading: false,
  error: null,

  fetchPublishedTestimonials: async () => {
    try {
      set({ loading: true, error: null });
      const response = await publicTestimonialApi.getPublishedTestimonials();
      set({ testimonials: response.data.data });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "Failed to fetch testimonials";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));
