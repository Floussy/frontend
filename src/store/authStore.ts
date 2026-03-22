import { create } from "zustand";
import { authApi } from "../api/auth";
import type { User, LoginRequest, RegisterRequest } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("auth_token"),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("auth_token"),

  login: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(data);
      const { user, token } = response.data.data;
      localStorage.setItem("auth_token", token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error("Login failed");
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(data);
      const { user, token } = response.data.data;
      localStorage.setItem("auth_token", token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error("Registration failed");
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("auth_token");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  fetchUser: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      const response = await authApi.getUser();
      set({ user: response.data.data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("auth_token");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),

  hydrate: () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      set({ token, isAuthenticated: true });
      get().fetchUser();
    }
  },
}));
