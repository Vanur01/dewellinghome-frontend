import { api } from "../utils/axiosInstance";
import { CreateProjectData, UpdateProjectData, ProjectItem } from "./types";

export const projectApi = {
  getProjects: (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get("/projects", { params }),

  searchProjects: (query: string) =>
    api.get("/projects/search", { params: { search: query } }),

  getUserProjects: (
    params?: {
    userId?: string,
      page?: number;
      limit?: number;
      status?: "planning" | "designing" | "in_progress" | "completed" | "on_hold";
      search?: string;
    }
  ) => api.get(`/projects/user-projects`, { params }),
  

  getProjectById: (id: string) => api.get(`/projects/${id}`),

  createProject: (data: CreateProjectData | FormData) =>
    api.post("/projects", data, {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
    }),

  updateProject: (id: string, data: UpdateProjectData | FormData) =>
    api.put(`/projects/${id}`, data, {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
    }),

  deleteProject: (id: string) => api.delete(`/projects/${id}`),

  addProjectItem: (projectId: string, item: Omit<ProjectItem, "_id">) =>
    api.post(`/projects/${projectId}/items`, item),

  removeProjectItem: (projectId: string, itemId: string) =>
    api.delete(`/projects/${projectId}/items/${itemId}`),

  uploadProjectImages: (projectId: string, images: FormData) =>
    api.post(`/projects/${projectId}/gallery`, images, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteProjectImage: (projectId: string, imageId: string) =>
    api.delete(`/projects/${projectId}/gallery/${imageId}`),
};
