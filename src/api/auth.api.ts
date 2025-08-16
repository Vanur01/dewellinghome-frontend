import { api } from "../utils/axiosInstance";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (
    email: string,
    password: string,
    name: string,
    address: string,
    phone: string
  ) => api.post("/auth/register", { email, password, name, address, phone }),

  logout: () => api.post("/auth/logout"),

  refresh: () => api.post("/auth/refresh"),

  me: () => api.get("/auth/me"),
};
