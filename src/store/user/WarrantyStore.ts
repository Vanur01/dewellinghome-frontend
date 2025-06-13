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
    adminNotes: string;
    createdAt: string;
    updatedAt: string;
}

interface WarrantyState {
    claims: UserWarrantyClaim[];
    loading: boolean;
    error: string | null;
    submitting: boolean;

    // Actions
    fetchUserClaims: () => Promise<void>; // <-- update signature
    createClaim: (data: FormData) => Promise<void>;
    resetError: () => void;
}

export const useWarrantyStore = create<WarrantyState>((set, get) => ({
    claims: [],
    loading: false,
    error: null,
    submitting: false,

    fetchUserClaims: async () => {
        set({ loading: true, error: null });
        try {
            const response = await warrantyApi.getUserClaims();
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

    createClaim: async (formData: FormData) => {
        set({ submitting: true, error: null });
        try {
            await warrantyApi.createWarrantyClaim(formData);
            // Refresh claims after successful creation
            await get().fetchUserClaims();
            set({ submitting: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to create warranty claim',
                submitting: false 
            });
            throw error; // Re-throw to handle in component
        }
    },

    resetError: () => set({ error: null })
}));
