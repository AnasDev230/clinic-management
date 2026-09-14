"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "warning" | "danger" | "success";
  isPending?: boolean;
}

const variantStyles: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-600",
  danger: "bg-red-500/10 text-red-600",
  success: "bg-emerald-500/10 text-emerald-600",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  isPending = false,
}: StatCardProps) {
  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-5">
          <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            variantStyles[variant],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <p className="truncate text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
