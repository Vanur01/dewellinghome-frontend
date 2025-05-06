import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance for public endpoints
const publicApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Types
export interface Design {
  _id: string;
  title: string;
  description: string;
  images: Array<{ url: string }>;
  gallery: string;
  createdAt: string;
  updatedAt: string;
}

export interface Gallery {
  _id: string;
  title: string;
  category: string;
  description: string;
  designs?: Design[];
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  address?: string;
  feedback: string;
  image?: string;
  youtubeLink?: string;
  rating?: number;
  showOnWebsite: boolean;
  createdAt: string;
  updatedAt: string;
}

// Public API endpoints
export const publicGalleryApi = {
  getAllGalleries: () => 
    publicApi.get<{ data: Gallery[] }>('/gallery'),

  getGalleryByCategory: (category: string) =>
    publicApi.get<{ data: Gallery[] }>(`/gallery/category/${category}`),

  getDesignsByGalleryId: (galleryId: string) =>
    publicApi.get<{ data: Design[] }>(`/gallery/${galleryId}/designs`),

  getSpecificDesign: (galleryId: string, designId: string) =>
    publicApi.get<{ data: Design }>(`/gallery/${galleryId}/designs/${designId}`),
};

export const publicTestimonialApi = {
  getPublishedTestimonials: () =>
    publicApi.get<{ data: Testimonial[] }>('/testimonials/published'),
};

export default publicApi; 