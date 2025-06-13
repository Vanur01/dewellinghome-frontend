
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "./api";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _isRefreshRequest?: boolean;
}

const base = import.meta.env.VITE_BASE_URL;
export const API_URL = base ? `${base}/api` : "http://13.203.249.85:8080/api";


// Create axios instance with default config
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Singleton promise for token refresh to prevent multiple refresh calls
let refreshTokenPromise: Promise<string | null> | null = null;

const refreshTokenSafely = async (): Promise<string | null> => {
  try {
    if (!refreshTokenPromise) {
      refreshTokenPromise = (async () => {
        try {
          const response = await authApi.refresh();
          const { accessToken } = response.data.data;
          return accessToken || null;
        } catch (error) {
          useAuthStore.getState().clearAuth();
          throw error;
        } finally {
          refreshTokenPromise = null;
        }
      })();
    }
    return refreshTokenPromise;
  } catch (error) {
    refreshTokenPromise = null;
    throw error;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    // Skip auth header for refresh token requests
    if (config.url?.includes("/auth/refresh")) {
      config._isRefreshRequest = true;
      return config;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refresh for auth endpoints (login, register, refresh)
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    // Don't retry refresh token requests, already retried requests, or auth endpoints
    if (
      originalRequest._isRefreshRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    // Only attempt refresh on 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const accessToken = await refreshTokenSafely();

      if (!accessToken) {
        throw new Error("Failed to refresh access token");
      }

      // Update the auth store with the new access token
      useAuthStore.getState().setAccessToken(accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (error) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }
  }
);