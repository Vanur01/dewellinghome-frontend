import { api } from "../utils/axiosInstance";

export const galleryApi = {
  // Admin endpoints only
  createGallery: (data: {
    title: string;
    category: string;
    description: string;
  }) => api.post("/gallery", data),

  updateGallery: (
    galleryId: string,
    data: {
      title?: string;
      category?: string;
      description?: string;
    }
  ) => api.put(`/gallery/${galleryId}`, data),

  deleteGallery: (galleryId: string) => api.delete(`/gallery/${galleryId}`),

  addDesignToGallery: (galleryId: string, data: FormData) =>
    api.post(`/gallery/${galleryId}/designs`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateDesign: (galleryId: string, designId: string, data: FormData) =>
    api.put(`/gallery/${galleryId}/designs/${designId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteDesign: (galleryId: string, designId: string) =>
    api.delete(`/gallery/${galleryId}/designs/${designId}`),
};
