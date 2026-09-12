"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useLogin } from "../hooks/use-login";
import { createLoginSchema, type LoginFormValues } from "../schemas/login-schema";

export function LoginForm() {
  const { t } = useTranslation();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse className="h-6 w-6" />
        </span>
        <CardTitle>{t("auth.login.title")}</CardTitle>
        <CardDescription>{t("auth.login.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
          className="space-y-4"
        >
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
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {loginMutation.isPending
              ? t("auth.login.submitting")
              : t("auth.login.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
