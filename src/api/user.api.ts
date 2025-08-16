import { api } from "../utils/axiosInstance";

export const userApi = {
  getAllUsers: (params: {
    page: number;
    limit: number;
    name: string;
    email: string;
    phone: string;
  }) => api.get("/users", { params }),

  searchUser: (params: {
    page: number;
    limit: number;
    name: string;
    phone: string;
  }) => api.get(`/users/search`, { params }),

  getUserById: (userId: string) => api.get(`/users/${userId}`),

  deleteUser: (userId: string) => api.delete(`/users/${userId}`),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role?: "admin" | "client";
  }) => api.post("/users", data),

  updateUser: (
    userId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ) => api.put(`/users/${userId}`, data),

  // Profile endpoints
  getProfile: () => api.get("/users/profile"),

  updateProfile: (data: FormData) =>
    api.put("/users/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
