import { create } from "zustand";
import { testimonialApi, Testimonial } from "../../utils/api";
import { toast } from "sonner";

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
      const response = await testimonialApi.getPublishedTestimonials();
      set({ testimonials: response.data.data });
    } catch (error) {
      const message = "Failed to fetch testimonials";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));
