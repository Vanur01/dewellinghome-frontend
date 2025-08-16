import { api } from "../utils/axiosInstance";

export const dashboardApi = {
  getOverview: () => api.get("/dashboard/overview"),
};
