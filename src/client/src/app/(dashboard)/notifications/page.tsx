"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { NotificationItem } from "@/types/notification";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMarkAsRead } from "@/features/notifications/hooks/use-mark-as-read";
import { useMarkAllAsRead } from "@/features/notifications/hooks/use-mark-all-as-read";
import { useDeleteNotification } from "@/features/notifications/hooks/use-delete-notification";
import { NotificationListPage } from "@/features/notifications/components/notification-list-page";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);

  const notificationsQuery = useNotifications({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    isRead: filter === "all" ? undefined : filter === "read",
  });

  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();

  const handleSelect = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("notifications.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("notifications.description")}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          disabled={markAllMutation.isPending}
          onClick={() => markAllMutation.mutate()}
        >
          <CheckCheck className="h-4 w-4" />
          {t("notifications.markAllRead")}
        </Button>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("notifications.all")}</SelectItem>
            <SelectItem value="unread">{t("notifications.unread")}</SelectItem>
            <SelectItem value="read">{t("notifications.markAsRead")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <NotificationListPage
        items={notificationsQuery.data?.items ?? []}
        isPending={notificationsQuery.isPending}
        onSelect={handleSelect}
        onMarkRead={(id) => markAsReadMutation.mutate(id)}
        onDelete={setDeleteTarget}
        isMarking={markAsReadMutation.isPending}
      />

      {(notificationsQuery.data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("common.page")} {notificationsQuery.data?.page} {t("common.of")}{" "}
            {notificationsQuery.data?.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                notificationsQuery.data != null && page >= notificationsQuery.data.totalPages
              }
              onClick={() => setPage(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
}
