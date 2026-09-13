"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Stethoscope,
  Users,
  CalendarDays,
  HeartPulse,
  Pill,
  BriefcaseMedical,
  FlaskConical,
  Receipt,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    { href: "/", label: t("nav.dashboard"), Icon: LayoutDashboard },
    { href: "/clinic", label: t("nav.clinic"), Icon: Building2 },
    { href: "/specialties", label: t("nav.specialties"), Icon: Layers },
    { href: "/doctors", label: t("nav.doctors"), Icon: Stethoscope },
    { href: "/patients", label: t("nav.patients"), Icon: Users },
    { href: "/appointments", label: t("nav.appointments"), Icon: CalendarDays },
    { href: "/visits", label: t("nav.visits"), Icon: HeartPulse },
    { href: "/prescriptions", label: t("nav.prescriptions"), Icon: Pill },
    { href: "/services", label: t("nav.services"), Icon: BriefcaseMedical },
    { href: "/lab-tests", label: t("nav.labTests"), Icon: FlaskConical },
    { href: "/billing", label: t("nav.billing"), Icon: Receipt },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-border bg-card transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:rtl:translate-x-0",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold">{t("app.name")}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map(({ href, label, Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
