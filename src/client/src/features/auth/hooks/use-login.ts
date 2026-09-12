import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import { getErrorMessage } from "@/lib/error-handler";
import { setAuthCookie } from "@/lib/utils";
import { login } from "../api/auth";
import type { LoginRequest } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const { t } = useTranslation();
  const { success, error } = useToast();
  const loginToStore = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      loginToStore(data.accessToken, data.refreshToken, {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        roles: data.roles,
      });
      setAuthCookie(data.accessToken);
      success(t("auth.login.success"), data.email);
      router.push("/");
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
