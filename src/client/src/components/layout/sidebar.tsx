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
  CreditCard,
  Bell,
  Paperclip,
  ScrollText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import {
  ROLE_ADMIN,
  ROLE_DOCTOR,
  ROLE_RECEPTIONIST,
  ROLE_SUPER_ADMIN,
  useUserRoles,
} from "@/hooks/use-user-roles";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const ALL_STAFF = [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_DOCTOR, ROLE_RECEPTIONIST];
const ADMIN_ONLY = [ROLE_SUPER_ADMIN, ROLE_ADMIN];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { canAccess } = useUserRoles();

  const links = [
    { href: "/", label: t("nav.dashboard"), Icon: LayoutDashboard, roles: [] as string[] },
    { href: "/patients", label: t("nav.patients"), Icon: Users, roles: ALL_STAFF },
    { href: "/doctors", label: t("nav.doctors"), Icon: Stethoscope, roles: ADMIN_ONLY },
    { href: "/appointments", label: t("nav.appointments"), Icon: CalendarDays, roles: ALL_STAFF },
    { href: "/visits", label: t("nav.visits"), Icon: HeartPulse, roles: [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_DOCTOR] },
    { href: "/prescriptions", label: t("nav.prescriptions"), Icon: Pill, roles: [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_DOCTOR] },
    { href: "/services", label: t("nav.services"), Icon: BriefcaseMedical, roles: ADMIN_ONLY },
    { href: "/lab-tests", label: t("nav.labTests"), Icon: FlaskConical, roles: [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_DOCTOR] },
    { href: "/billing", label: t("nav.billing"), Icon: Receipt, roles: [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_RECEPTIONIST] },
    { href: "/billing/payments", label: t("nav.payments"), Icon: CreditCard, roles: [ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_RECEPTIONIST] },
    { href: "/clinic", label: t("nav.clinic"), Icon: Building2, roles: ADMIN_ONLY },
    { href: "/specialties", label: t("nav.specialties"), Icon: Layers, roles: ADMIN_ONLY },
    { href: "/notifications", label: t("nav.notifications"), Icon: Bell, roles: [] as string[] },
    { href: "/attachments", label: t("nav.attachments"), Icon: Paperclip, roles: [] as string[] },
    { href: "/audit-logs", label: t("nav.auditLogs"), Icon: ScrollText, roles: ADMIN_ONLY },
  ];

  const visibleLinks = links.filter((link) => canAccess(link.roles));

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
          {visibleLinks.map(({ href, label, Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
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
