import { api } from "../utils/axiosInstance";

export const testimonialApi = {
  getAllTestimonials: (params?: { page?: number; limit?: number }) =>
    api.get("/testimonials", { params }),

  getTestimonialById: (id: string) => api.get(`/testimonials/${id}`),

  createTestimonial: (data: FormData) =>
    api.post("/testimonials", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateTestimonial: (id: string, data: FormData) =>
    api.put(`/testimonials/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`),
};
