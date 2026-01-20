/**
 * Store de Autenticación
 * Gestiona el estado de autenticación del usuario, tokens y operaciones de login/logout
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

/**
 * Interfaz del estado de autenticación
 * Contiene datos de usuario, token JWT y funciones de autenticación
 */
export interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  setToken: (token: string) => void;
  setUser: (userId: string, email: string, username?: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      email: null,
      username: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });
          const { token, user } = response.data.data;
          set({
            token,
            userId: user.id.toString(),
            email: user.email,
            username: user.username,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const errorMessage =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Login failed";
          set({ error: errorMessage, isLoading: false });
          throw err;
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password,
          });
          const { token, user } = response.data.data;
          set({
            token,
            userId: user.id.toString(),
            email: user.email,
            username: user.username,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const errorMessage =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Registration failed";
          set({ error: errorMessage, isLoading: false });
          throw err;
        }
      },

      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      setUser: (userId, email, username = "") =>
        set({
          userId,
          email,
          username,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          userId: null,
          email: null,
          username: null,
          isAuthenticated: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      version: 1,
    }
  )
);

export default useAuthStore;
