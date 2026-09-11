"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartPulse, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import apiClient from "@/lib/api-client";
import { getErrorMessage } from "@/lib/error-handler";
import { setAuthCookie } from "@/lib/utils";
import type { TranslationKey } from "@/lib/translations/en";
import type { ApiResponse } from "@/types/common";
import type { LoginResponse } from "@/types/auth";

function createLoginSchema(t: (key: TranslationKey) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("auth.login.validation.emailRequired"))
      .email(t("auth.login.validation.emailInvalid")),
    password: z
      .string()
      .min(1, t("auth.login.validation.passwordRequired"))
      .min(8, t("auth.login.validation.passwordMin")),
  });
}

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { success, error } = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);
  const login = useAuthStore((s) => s.login);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsPending(true);
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        values,
      );
      const data = response.data.data;
      login(data.accessToken, data.refreshToken, {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        roles: data.roles,
      });
      setAuthCookie(data.accessToken);
      success(t("auth.login.success"), data.email);
      router.push("/");
    } catch (err) {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="h-6 w-6" />
          </span>
          <CardTitle>{t("auth.login.title")}</CardTitle>
          <CardDescription>{t("auth.login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t("auth.login.emailPlaceholder")}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder={t("auth.login.passwordPlaceholder")}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? t("auth.login.submitting") : t("auth.login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
