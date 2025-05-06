export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  address?: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthState {
  userId: string;
  user: AuthUser | null;
  accessToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface AuthStore extends AuthState {
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (email: string, password: string, name: string, address: string, phone: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<string>;
  restoreSession: () => Promise<void>;
}
