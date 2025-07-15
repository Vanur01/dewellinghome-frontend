import { create } from 'zustand';
import { partnerApi, Partner } from '@/utils/api';

interface PartnerStore {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  selectedPartner: Partner | null;
  
  // Actions
  fetchPartners: () => Promise<void>;
  createPartner: (formData: FormData) => Promise<void>;
  updatePartner: (id: string, formData: FormData) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  setSelectedPartner: (partner: Partner | null) => void;
}

const usePartnerStore = create<PartnerStore>((set, get) => ({
  partners: [],
  loading: false,
  error: null,
  selectedPartner: null,

  fetchPartners: async () => {
    try {
      set({ loading: true, error: null });
      const response = await partnerApi.getAllPartnersAdmin();
      set({ partners: response.data.data, loading: false });
      console.log('Fetched partners:', response.data.data);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch partners',
        loading: false 
      });
    }
  },

  createPartner: async (formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const response = await partnerApi.createPartner(formData);
      set(state => ({
        partners: [...state.partners, response.data.data],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create partner',
        loading: false 
      });
    }
  },

  updatePartner: async (id: string, formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const response = await partnerApi.updatePartner(id, formData);
      set(state => ({
        partners: state.partners.map(partner => 
          partner._id === id ? response.data.data : partner
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update partner',
        loading: false 
      });
    }
  },

  deletePartner: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await partnerApi.deletePartner(id);
      set(state => ({
        partners: state.partners.filter(partner => partner._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete partner',
        loading: false 
      });
    }
  },

  setSelectedPartner: (partner: Partner | null) => {
    set({ selectedPartner: partner });
  },
}));

export default usePartnerStore;
