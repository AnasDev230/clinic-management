"use client";

import Link from "next/link";
import { Building2, Stethoscope } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function DashboardPage() {
  const { t } = useTranslation();

  const shortcuts = [
    { href: "/clinic", title: t("nav.clinic"), Icon: Building2 },
    { href: "/specialties", title: t("nav.specialties"), Icon: Stethoscope },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("dashboard.description")}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.welcome")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {shortcuts.map(({ href, title, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{title}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
