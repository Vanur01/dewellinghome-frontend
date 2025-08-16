import { api } from "../utils/axiosInstance";
import { InquiryItem, KitchenConfiguration } from "./types";

export const inquiryApi = {
  createInquiry: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    message?: string;
    countryCode?: string;
    homeType?: string;
    purpose?: string;
    items?: InquiryItem[];
    kitchenConfiguration?: KitchenConfiguration;
  }) => api.post("/inquiries", data),

  getInquiries: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    phone?: string;
    email?: string;
    status: string;
  }) =>
    api.get("/inquiries", {
      params: { ...params, limit: params?.limit || 10 },
    }),

  getInquiryById: (id: string) => api.get(`/inquiries/${id}`),

  updateInquiryStatus: (id: string, status: string) =>
    api.patch(`/inquiries/${id}/status`, { status }),

  deleteInquiry: (id: string) => api.delete(`/inquiries/${id}`),
};
