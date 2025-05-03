import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthStore, AuthUser } from '../types/auth';
import { authApi } from '../utils/api';

// Initial state with proper typing
const initialState: AuthState = {
  user: null,
  accessToken: '',
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },

      setUser: (user: AuthUser | null) => {
        set({ user, isAuthenticated: !!user });
      },

      clearAuth: () => {
        set(initialState);
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password);
          const { user, accessToken } = response.data.data;
          
          if (!accessToken || !user) {
            throw new Error('Invalid response data');
          }
          
          set({ accessToken, user, isAuthenticated: true });
          return { user, accessToken };
        } catch (error) {
          set(initialState);
          throw error;
        } finally {
          set(state => ({ ...state, isLoading: false }));
        }
      },

      signup: async (email: string, password: string, name: string, address: string, phone: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(email, password, name, address, phone);
          const { user, accessToken } = response.data.data;
          
          if (!accessToken || !user) {
            throw new Error('Invalid response data');
          }
          
          set({ accessToken, user, isAuthenticated: true });
          return { user, accessToken };
        } catch (error) {
          set(initialState);
          throw error;
        } finally {
          set(state => ({ ...state, isLoading: false }));
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set(initialState);
        }
      },

      refreshTokens: async () => {
        // Don't set loading state for refresh token requests
        try {
          const response = await authApi.refresh();
          const { accessToken } = response.data.data;
          console.log(response.data.data);
          
          if (!accessToken) {
            set(initialState);
            throw new Error('No access token received');
          }
          
          set(state => ({ ...state, accessToken }));
          return accessToken;
        } catch (error) {
          set(initialState);
          throw error;
        }
      },
      
      restoreSession: async () => {
        // Prevent multiple simultaneous restore attempts
        if (get().isLoading) {
          return;
        }

        set({ isLoading: true });
        try {
          // First try to refresh the token
          const accessToken = await get().refreshTokens();
          
          if (!accessToken) {
            set(initialState);
            return;
          }

          // Then fetch user data
          const meResponse = await authApi.me();
          const { user } = meResponse.data.data;
          
          if (!user) {
            throw new Error('No user data received');
          }

          set({ user, isAuthenticated: true, accessToken });
        } catch (error) {
          // Any error in the process should clear the auth state
          set(initialState);
          // Don't throw the error as this is a background operation
        } finally {
          set(state => ({ ...state, isLoading: false }));
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
); 