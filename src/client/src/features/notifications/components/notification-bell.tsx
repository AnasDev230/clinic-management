"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import type { NotificationItem } from "@/types/notification";
import { useUnreadCount } from "../hooks/use-unread-count";
import { NotificationDropdown } from "./notification-dropdown";

interface NotificationBellProps {
  onDelete: (notification: NotificationItem) => void;
}

export function NotificationBell({ onDelete }: NotificationBellProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const unreadQuery = useUnreadCount();
  const count = unreadQuery.data?.count ?? 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("notifications.title")}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute end-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground tabular-nums">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
      <NotificationDropdown open={open} onClose={() => setOpen(false)} onDelete={onDelete} />
    </div>
  );
}
