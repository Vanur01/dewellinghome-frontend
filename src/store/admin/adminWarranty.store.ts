import { create } from 'zustand';
import { warrantyApi } from '../../utils/api';

export interface WarrantyClaim {
    _id: string;
    ticketId: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    project: string;
    item: string;
    description: string;
    images: string[];
    status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'resolved';
    adminNotes: string;
    createdAt: string;
    updatedAt: string;
}

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalClaims: number;
    limit: number;
}

interface AdminWarrantyState {
    claims: WarrantyClaim[];
    loading: boolean;
    error: string | null;
    pagination: PaginationState;
    filters: {
        status?: WarrantyClaim['status'] | 'all';
        ticketId?: string;
        name?: string;
    };

    // Actions
    fetchClaims: (page?: number) => Promise<void>;
    updateClaimStatus: (id: string, status: WarrantyClaim['status'], adminNotes?: string) => Promise<void>;
    deleteClaim: (id: string) => Promise<void>;
    setFilters: (filters: Partial<AdminWarrantyState['filters']>) => void;
}

export const useAdminWarrantyStore = create<AdminWarrantyState>((set, get) => ({
    claims: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalClaims: 0,
        limit: 10
    },
    filters: {
        status: 'all'
    },

    fetchClaims: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const { filters } = get();
            const params = {
                page,
                limit: get().pagination.limit,
                ...(filters.status !== 'all' && { status: filters.status as WarrantyClaim['status'] }),
                ...(filters.ticketId && { ticketId: filters.ticketId }),
                ...(filters.name && { name: filters.name })
            };
            
            const response = await warrantyApi.getAllClaims(params);
            
            set({
                claims: response.data.data.claims,
                pagination: response.data.data.pagination,
                loading: false
            });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch claims',
                loading: false 
            });
        }
    },

    updateClaimStatus: async (id: string, status: WarrantyClaim['status'], adminNotes?: string) => {
        set({ loading: true, error: null });
        try {
            await warrantyApi.updateClaimStatus(id, { status, adminNotes });
            // Refresh claims after update
            await get().fetchClaims(get().pagination.currentPage);
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to update claim status',
                loading: false 
            });
        }
    },

    deleteClaim: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await warrantyApi.deleteClaim(id);
            // Refresh claims after deletion
            await get().fetchClaims(get().pagination.currentPage);
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to delete claim',
                loading: false 
            });
        }
    },

    setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchClaims(1); // Reset to first page when filters change
    }
}));
