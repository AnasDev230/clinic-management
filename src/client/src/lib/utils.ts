import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  const maxAge = 30 * 60; // 30 minutes, matches access token lifetime
  document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
}
