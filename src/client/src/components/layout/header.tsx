"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useDeleteNotification } from "@/features/notifications/hooks/use-delete-notification";
import type { NotificationItem } from "@/types/notification";
import apiClient from "@/lib/api-client";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { success } = useToast();
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);
  const deleteMutation = useDeleteNotification();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Logout locally even if the server call fails.
    } finally {
      logout();
      success(t("nav.logout"));
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">{t("app.tagline")}</span>
      </div>
      <div className="flex items-center gap-1">
        <NotificationBell onDelete={setDeleteTarget} />
        <LanguageToggle />
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label={t("nav.logout")}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deleteNotification.title")}
        description={t("confirm.deleteNotification.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </header>
  );
}
