import { api } from "../utils/axiosInstance";

export const warrantyApi = {
  createWarrantyClaim: (formData: FormData) =>
    api.post("/warranty", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getUserClaims: (params?:{userId:string}) => api.get("/warranty/user-warranty-claims",{ params }),

  getAllClaims: (params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "in-review" | "approved" | "rejected" | "resolved";
  }) => api.get("/warranty", { params }),

  getClaimById: (id: string) => api.get(`/warranty/${id}`),

  updateClaimStatus: (
    id: string,
    data: {
      status: "pending" | "in-review" | "approved" | "rejected" | "resolved";
      adminNotes?: string;
    }
  ) => api.patch(`/warranty/${id}/status`, data),

  deleteClaim: (id: string) => api.delete(`/warranty/${id}`),
};
