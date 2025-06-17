import { create } from 'zustand';
import { warrantyApi } from '../../utils/api';

export interface UserWarrantyClaim {
    _id: string;
    ticketId: string;
    project: string;
    item: string;
    description: string;
    images: string[];
    status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'resolved';
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

interface WarrantyState {
    claims: UserWarrantyClaim[];
    loading: boolean;
    error: string | null;
    submitting: boolean;

    // Actions
    fetchUserClaims: (params?: { userId: string }) => Promise<void>;
    createClaim: (formData: FormData) => Promise<void>;
    clearError: () => void;
}

export const useWarrantyStore = create<WarrantyState>((set) => ({
    claims: [],
    loading: false,
    error: null,
    submitting: false,

    fetchUserClaims: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await warrantyApi.getUserClaims(params);
            set({
                claims: response.data.data.claims,
                loading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch claims',
                loading: false
            });
        }
    },

    createClaim: async (formData) => {
        try {
            set({ submitting: true, error: null });
            await warrantyApi.createWarrantyClaim(formData);
            // Refresh claims after creating new one
            const response = await warrantyApi.getUserClaims();
            set({
                claims: response.data.data.claims,
                submitting: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create claim',
                submitting: false
            });
            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    }
}));
