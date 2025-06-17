import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthState, AuthStore, AuthUser } from "../types/auth";
import { authApi } from "../utils/api";

const initialState: AuthState = {
  userId: "",
  user: null,
  accessToken: "",
  isAuthenticated: false,
  isLoading: false,
};


export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAccessToken: (token: string) => {
        Cookies.set("access_token", token);
        set({ accessToken: token });
      },

      setUser: (user: AuthUser | null) => {
        set({ user, isAuthenticated: !!user });
      },

      clearAuth: () => {
        Cookies.remove("access_token");
        set(initialState);
        // Optional: Clear localStorage manually if needed
        localStorage.removeItem("auth-storage");
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password);
          const { user, accessToken } = response.data.data;

          if (!user || !accessToken) throw new Error("Invalid login response");

          Cookies.set("access_token", accessToken);
          set({ accessToken, user, isAuthenticated: true });
          return { user, accessToken };
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (email, password, name, address, phone) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(email, password, name, address, phone);
          const { user, accessToken } = response.data.data;

          if (!user || !accessToken) throw new Error("Invalid signup response");

          Cookies.set("access_token", accessToken);
          set({ accessToken, user, isAuthenticated: true });
          return { user, accessToken };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (err) {
          console.warn("Logout failed:", err);
        } finally {
          get().clearAuth(); // 🔁 Use consistent cleanup
        }
      },

      refreshTokens: async () => {
        const currentToken = get().accessToken || Cookies.get("access_token");

        if (currentToken) {
          set({ accessToken: currentToken });
          return currentToken;
        }

        try {
          const response = await authApi.refresh();
          const { accessToken } = response.data.data;

          if (!accessToken) throw new Error("No access token received");

          Cookies.set("access_token", accessToken);
          set({ accessToken });
          return accessToken;
        } catch (error) {
          await get().logout(); // ✅ Consistent cleanup
          throw error;
        }
      },

      restoreSession: async () => {
        if (get().isLoading) return;

        set({ isLoading: true });

        try {
          // Step 1: Get token from Zustand or cookie
          let token = get().accessToken;

          if (!token) {
            const cookieToken = Cookies.get("access_token");
            if (cookieToken) {
              token = cookieToken;
              set({ accessToken: token });
            }
          }

          // Step 2: If still no token, try refresh
          if (!token) {
            token = await get().refreshTokens();
          }

          // Step 3: Try getting user from localStorage
          if (typeof window !== "undefined") {
            const persistedAuth = localStorage.getItem("auth-storage");
            const parsed = persistedAuth ? JSON.parse(persistedAuth) : null;

            if (parsed?.state?.user) {
              set({
                user: parsed.state.user,
                isAuthenticated: true,
              });
              return;
            }
          }

          // Step 4: Fallback — call /me
          const meResponse = await authApi.me();
          const { user } = meResponse.data.data;

          if (!user) throw new Error("No user data received from /me");

          set({ user, isAuthenticated: true });
        } catch (error) {
          await get().logout(); // ✅ Call consistent logout
          console.error("Session restoration failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
