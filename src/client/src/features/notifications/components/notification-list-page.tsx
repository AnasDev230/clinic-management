"use client";

import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { NotificationItem } from "@/types/notification";
import { NotificationItemRow } from "./notification-item";

interface NotificationListPageProps {
  items: NotificationItem[];
  isPending: boolean;
  onSelect: (notification: NotificationItem) => void;
  onMarkRead: (id: string) => void;
  onDelete: (notification: NotificationItem) => void;
  isMarking: boolean;
}

export function NotificationListPage({
  items,
  isPending,
  onSelect,
  onMarkRead,
  onDelete,
  isMarking,
}: NotificationListPageProps) {
  const { t } = useTranslation();

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-border p-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <BellRing className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">{t("notifications.empty.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("notifications.empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {items.map((notification) => (
        <NotificationItemRow
          key={notification.id}
          notification={notification}
          onSelect={onSelect}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
          isMarking={isMarking}
        />
      ))}
    </div>
  );
}

export function NotificationListActions({ onMarkAll }: { onMarkAll: () => void }) {
  const { t } = useTranslation();
  return (
    <Button variant="outline" size="sm" onClick={onMarkAll}>
      {t("notifications.markAllRead")}
    </Button>
  );
}
