"use client";

import { useRouter } from "next/navigation";
import { BellRing, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { NotificationItem } from "@/types/notification";
import { useLatestNotifications } from "../hooks/use-latest-notifications";
import { useMarkAsRead } from "../hooks/use-mark-as-read";
import { useMarkAllAsRead } from "../hooks/use-mark-all-as-read";
import { NotificationItemRow } from "./notification-item";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  onDelete: (notification: NotificationItem) => void;
}

export function NotificationDropdown({ open, onClose, onDelete }: NotificationDropdownProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const latestQuery = useLatestNotifications(5);
  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();

  if (!open) return null;

  const handleSelect = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    onClose();
    router.push(notification.actionUrl || "/notifications");
  };

  const items = latestQuery.data ?? [];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div className="absolute end-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-96">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <p className="text-sm font-semibold">{t("notifications.title")}</p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              disabled={markAllMutation.isPending}
              onClick={() => markAllMutation.mutate()}
            >
              <CheckCheck className="h-4 w-4" />
              {t("notifications.markAllRead")}
            </Button>
          </div>
        </div>
        <div className="max-h-96 divide-y divide-border overflow-y-auto">
          {latestQuery.isPending &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 px-4 py-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          {!latestQuery.isPending && items.length === 0 && (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <BellRing className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">{t("notifications.empty.title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("notifications.empty.description")}
              </p>
            </div>
          )}
          {items.map((notification) => (
            <NotificationItemRow
              key={notification.id}
              notification={notification}
              onSelect={handleSelect}
              onMarkRead={(id) => markAsReadMutation.mutate(id)}
              onDelete={onDelete}
              isMarking={markAsReadMutation.isPending}
            />
          ))}
        </div>
        <div className="border-t border-border px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              onClose();
              router.push("/notifications");
            }}
          >
            {t("notifications.viewAll")}
          </Button>
        </div>
      </div>
    </>
  );
}
