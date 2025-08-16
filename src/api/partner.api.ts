import { api } from "../utils/axiosInstance";
import { Partner } from "./types";

export const partnerApi = {
  // Get all active partners (public)
  getAllPartners: () => 
    api.get<{ data: Partner[] }>('/partners'),

  // Get all partners including inactive (admin)
  getAllPartnersAdmin: () => 
    api.get<{ data: Partner[] }>('/partners/admin'),

  // Create new partner (admin)
  createPartner: (formData: FormData) =>
    api.post<{ data: Partner }>('/partners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Update partner (admin)
  updatePartner: (id: string, formData: FormData) =>
    api.patch<{ data: Partner }>(`/partners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Delete partner (admin)
  deletePartner: (id: string) =>
    api.delete<{ message: string }>(`/partners/${id}`),
};
