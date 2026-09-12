"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ToastContainer } from "@/components/ui/toast-container";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { getDirection } from "@/lib/i18n";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const language = useLanguageStore((s) => s.language);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={getDirection(language)}>
        {children}
        <ToastContainer />
      </DirectionProvider>
    </QueryClientProvider>
  );
}
