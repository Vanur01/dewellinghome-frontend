import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InquiryItem, KitchenConfiguration, WallDimension } from '../utils/api';

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  countryCode: string;
  message: string;
}

interface ProjectDetails {
  homeType: string;
  purpose: string;
  items: InquiryItem[];
  kitchenConfiguration?: KitchenConfiguration;
}

interface EnquiryData {
  userDetails: UserDetails;
  projectDetails: ProjectDetails;
  setUserDetails: (data: Partial<UserDetails>) => void;
  setProjectDetails: (data: Partial<ProjectDetails>) => void;
  setKitchenConfiguration: (data: Partial<KitchenConfiguration>) => void;
  resetEnquiryData: () => void;
}

const initialWallDimension: WallDimension = {
  feet: 0,
  inches: 0,
};

const initialKitchenConfiguration: KitchenConfiguration = {
  homeType: '',
  kitchenLayout: '',
  wallDimensions: {
    wallA: {
      length: initialWallDimension,
      height: initialWallDimension
    },
    wallB: {
      length: initialWallDimension,
      height: initialWallDimension
    },
    wallC: {
      length: initialWallDimension,
      height: initialWallDimension
    }
  },
  cabinetMaterial: '',
  shutterMaterial: '',
  accessories: {},
};

const initialUserDetails: UserDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  pincode: '',
  countryCode: '',
  message: ''
};

const initialProjectDetails: ProjectDetails = {
  homeType: '',
  purpose: '',
  items: [],
  kitchenConfiguration: initialKitchenConfiguration,
};

const initialState: EnquiryData = {
  userDetails: initialUserDetails,
  projectDetails: initialProjectDetails,
  setUserDetails: () => {},
  setProjectDetails: () => {},
  setKitchenConfiguration: () => {},
  resetEnquiryData: () => {}
};

const enquiryStore = create<EnquiryData>()(
  persist(
    (set,get) => ({
      ...initialState,
      setUserDetails: (data: Partial<UserDetails>) => {
        set((state) => ({
          ...state,
          userDetails: {
            ...state.userDetails,
            ...data
          }
        }));
      },
      setProjectDetails: (data: Partial<ProjectDetails>) => {
        set((state) => ({
          ...state,
          projectDetails: {
            ...state.projectDetails,
            ...data
          }
        }));
      },
      setKitchenConfiguration: (data: Partial<KitchenConfiguration>) => {
        set((state) => ({
          ...state,
          projectDetails: {
            ...state.projectDetails,
            kitchenConfiguration: {
              ...state.projectDetails.kitchenConfiguration,
              ...data
            }
          }
        }));
        console.log(get().projectDetails.kitchenConfiguration);
      },
      resetEnquiryData: () => {
        // Reset to initial state while preserving function references
        set((state) => ({
          ...state,
          userDetails: initialUserDetails,
          projectDetails: initialProjectDetails,
        }));
        // Directly remove from localStorage
        localStorage.removeItem('enquiry-store');
      }
    }),
    {
      name: 'enquiry-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userDetails: state.userDetails,
        projectDetails: state.projectDetails
      })
    }
  )
);

export default enquiryStore;