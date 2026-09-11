"use client";

import { useCallback } from "react";
import { create } from "zustand";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
}

let counter = 0;
function nextId(): string {
  counter += 1;
  return `toast-${Date.now()}-${counter}`;
}

const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
  warning: 4000,
  info: 4000,
};

export function useToast() {
  const toasts = useToastStore((s) => s.toasts);

  const show = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = useToastStore.getState().push({ variant, title, description });
      window.setTimeout(() => {
        useToastStore.getState().removeToast(id);
      }, DURATIONS[variant]);
    },
    [],
  );

  const success = useCallback(
    (title: string, description?: string) => show("success", title, description),
    [show],
  );
  const error = useCallback(
    (title: string, description?: string) => show("error", title, description),
    [show],
  );
  const warning = useCallback(
    (title: string, description?: string) => show("warning", title, description),
    [show],
  );
  const info = useCallback(
    (title: string, description?: string) => show("info", title, description),
    [show],
  );

  const removeToast = useCallback((id: string) => {
    useToastStore.getState().removeToast(id);
  }, []);

  return { toasts, success, error, warning, info, removeToast };
}
