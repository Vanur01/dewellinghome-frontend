import { create } from 'zustand';
import { referralApi } from '../../utils/api';

interface refferedBytype {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Referral {
  _id: string;
  refId:string;
  referralName: string;
  referralEmail: string;
  referralPhone: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  date: string;
  referredBy: refferedBytype;
  referralAddress?: string;
  relationship?: string;
  notes?: string;
  rewardMessage?: string;
  createdAt: string;
}

interface SearchParams {
  name?: string;
  phone?: string;
  refId?:string;
  status?: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface AdminReferralsState {
  referrals: Referral[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  searchParams: SearchParams;
  fetchReferrals: (page?: number, search?: SearchParams) => Promise<void>;
  updateReferralStatus: (referralId: string, status: Referral['status']) => Promise<void>;
  updateRewardMessage: (referralId: string, rewardMessage: string) => Promise<void>;
  setSearchParams: (params: SearchParams) => void;
}

export const useAdminReferralsStore = create<AdminReferralsState>((set, get) => ({
  referrals: [],
  loading: false,
  error: null,
  searchParams: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  },

  setSearchParams: (params) => {
    set({ searchParams: params });
  },

  fetchReferrals: async (page = 1, searchParams = {}) => {
    const { limit } = get().pagination;
    const currentSearchParams = { ...searchParams };
  
    set({ loading: true, error: null, searchParams: currentSearchParams });
  
    try {
      const response = await referralApi.getAllReferrals({
        page,
        limit,
        name: currentSearchParams.name || '',
        phone: currentSearchParams.phone || '',
        refId: currentSearchParams.refId || '',
        status: currentSearchParams.status==="all"? "":  currentSearchParams.status || ''
      });
  
      const { referrals, pagination } = response.data.data;
  
      set({
        referrals: referrals || [],
        loading: false,
        error: null,
        pagination: {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalRecords: pagination.totalRecords,
          limit: pagination.limit
        }
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch referrals',
        referrals: []
      });
    }
  },

  updateReferralStatus: async (referralId, status) => {
    set({ error: null });
    
    // Store the current state for potential rollback
    const currentReferrals = get().referrals;
    
    // Optimistically update the UI
    set((state) => ({
      referrals: state.referrals.map((referral) =>
        referral._id === referralId
          ? { ...referral, status }
          : referral
      ),
    }));
  
    try {
      await referralApi.updateReferralStatus(referralId, status);
    } catch (error) {
      // Rollback on error
      set({ referrals: currentReferrals });
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update referral status'
      });
      throw error;
    }
  },

  updateRewardMessage: async (referralId, rewardMessage) => {
    set({ error: null });
    try {
      const response = await referralApi.updateReferralRewardMessage(referralId, rewardMessage);
      set((state) => ({
        referrals: state.referrals.map((referral) =>
          referral._id === referralId
            ? { ...referral, ...response.data.data }
            : referral
        ),
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update reward message'
      });
      throw error;
    }
  },
}));