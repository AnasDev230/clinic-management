"use client";

import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/translations/en";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types/notification";
import { NotificationTypeIcon } from "./notification-type-icon";

export function formatTimeAgo(
  date: string | Date,
  t: (key: TranslationKey) => string,
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - value.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return t("notifications.timeAgo.justNow");
  if (minutes < 60) return `${minutes} ${t("notifications.timeAgo.minutesAgo")}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t("notifications.timeAgo.hoursAgo")}`;

  const days = Math.floor(hours / 24);
  return `${days} ${t("notifications.timeAgo.daysAgo")}`;
}

interface NotificationItemProps {
  notification: NotificationItem;
  onSelect: (notification: NotificationItem) => void;
  onMarkRead: (id: string) => void;
  onDelete: (notification: NotificationItem) => void;
  isMarking?: boolean;
}

export function NotificationItemRow({
  notification,
  onSelect,
  onMarkRead,
  onDelete,
  isMarking = false,
}: NotificationItemProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30",
        !notification.isRead && "bg-primary/5",
      )}
      onClick={() => onSelect(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(notification);
      }}
    >
      <span className="mt-0.5 text-muted-foreground">
        <NotificationTypeIcon type={notification.type} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          )}
          <p className="truncate text-sm font-medium">{notification.title}</p>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
          {formatTimeAgo(notification.createdAt, t)}
        </p>
      </div>
      <div
        className="flex shrink-0 items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon"
            disabled={isMarking}
            onClick={() => onMarkRead(notification.id)}
            aria-label={t("notifications.markAsRead")}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(notification)}
          aria-label={t("notifications.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
