import { create } from "zustand";
import { inquiryApi, KitchenConfiguration, InquiryItem, WallDimension } from "../../utils/api";

// Re-export the wall dimension types for consistency
export interface WallDimensionData {
  length: WallDimension;
  height: WallDimension;
}

export interface WallDimensionsData {
  wallA: WallDimensionData;
  wallB?: WallDimensionData;
  wallC?: WallDimensionData;
}

export interface CustomerInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "closed";
  countryCode: string;
  homeType: string;
  purpose: string;
  items: InquiryItem[];
  kitchenConfiguration?: KitchenConfiguration;
  createdAt: string;
}

interface searchparams {
  name?: string;
  email?: string;
  phone?: string;
  status?: "new" | "contacted" | "converted" | "closed" | "all";
}

interface InquiryState {
  inquiries: CustomerInquiry[];
  loading: boolean;
  error: string | null;
  searchparams: searchparams;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
  fetchInquiries: (
    page?: number,
    limit?: number,
    searchparams?: searchparams
  ) => Promise<void>;
  updateInquiryStatus: (
    inquiryId: string,
    status: CustomerInquiry["status"]
  ) => Promise<void>;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  inquiries: [],
  loading: false,
  error: null,
  searchparams: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },

  fetchInquiries: async (page = 1, limit = 10, searchparams= {}) => {
    const currentSearchParams = { ...searchparams };
    if(currentSearchParams.status === "all") delete currentSearchParams.status;

    set({ loading: true, error: null });
    try {
      const response = await inquiryApi.getInquiries({
        page,
        limit,
        name: currentSearchParams.name || "",
        phone: currentSearchParams.phone || "",
        email: currentSearchParams.email || "",
        status: currentSearchParams.status || "",
      });

      const { inquiries, pagination } = response.data.data;
      set({
        inquiries: inquiries || [],
        loading: false,
        error: null,
        pagination: {
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalRecords: pagination.total,
          limit: pagination.limit,
        },
        searchparams: currentSearchParams,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch inquiries",
      });
    }
  },

  updateInquiryStatus: async (inquiryId, status) => {
    set({ error: null });
    try {
      await inquiryApi.updateInquiryStatus(inquiryId, status);
      set((state) => ({
        inquiries: state.inquiries.map((inquiry) =>
          inquiry._id === inquiryId ? { ...inquiry, status } : inquiry
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update inquiry status",
      });
      throw error;
    }
  },
}));
