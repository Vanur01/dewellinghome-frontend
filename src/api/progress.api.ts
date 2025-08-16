import { api } from "../utils/axiosInstance";

export const progressApi = {
  getAllProgress: (params?: { page?: number; limit?: number }) =>
    api.get("/progress", { params }),

  getProjectProgress: (
    projectId: string,
    params?: { page?: number; limit?: number }
  ) => api.get(`/progress/project/${projectId}`, { params }),

  getProgressById: (id: string) => api.get(`/progress/${id}`),

  createProgress: (data: FormData) =>
    api.post("/progress", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateProgress: (id: string, data: FormData) =>
    api.put(`/progress/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteProgress: (id: string) => api.delete(`/progress/${id}`),
};
