"use client";

import { create } from "zustand";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { clearAuthCookie } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
}

function readStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: readStored(ACCESS_TOKEN_KEY),
  refreshToken: readStored(REFRESH_TOKEN_KEY),
  user: null,
  login: (accessToken, refreshToken, user) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    set({ accessToken, refreshToken, user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      clearAuthCookie();
    }
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
