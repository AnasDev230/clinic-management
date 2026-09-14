"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </span>
      <h1 className="text-2xl font-semibold tabular-nums">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t("common.notFound")}
      </p>
      <Link href="/">
        <Button className="gap-2">{t("nav.dashboard")}</Button>
      </Link>
    </div>
  );
}
