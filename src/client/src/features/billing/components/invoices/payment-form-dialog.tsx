"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/formatters";
import {
  createPaymentSchema,
  type PaymentFormValues,
} from "../../schemas/payment-schema";
import { useCreatePayment } from "../../hooks/use-create-payment";
import { PaymentMethod } from "@/types/payment";

interface PaymentFormDialogProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  remainingBalance: number;
}

export function PaymentFormDialog({
  open,
  onClose,
  invoiceId,
  remainingBalance,
}: PaymentFormDialogProps) {
  const { t, language } = useTranslation();
  const schema = useMemo(
    () => createPaymentSchema(t, remainingBalance),
    [t, remainingBalance],
  );
  const createMutation = useCreatePayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: remainingBalance,
      paymentMethod: PaymentMethod.Cash,
      referenceNumber: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: remainingBalance,
        paymentMethod: PaymentMethod.Cash,
        referenceNumber: "",
        notes: "",
      });
    }
  }, [open, remainingBalance, form]);

  const onSubmit = (values: PaymentFormValues) => {
    createMutation.mutate(
      {
        invoiceId,
        amount: Number(values.amount),
        paymentMethod: Number(values.paymentMethod) as PaymentMethod,
        referenceNumber: values.referenceNumber || null,
        notes: values.notes || null,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("payments.recordPayment")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t("payments.remainingBalance")}</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(remainingBalance, language)}
            </span>
          </div>
          <div className="space-y-2">
            <Label>{t("payments.form.amount")}</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...form.register("amount")}
              className="h-10 tabular-nums"
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("payments.form.method")}</Label>
            <Select
              value={String(form.watch("paymentMethod"))}
              onValueChange={(v) => form.setValue("paymentMethod", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("payments.form.method")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(PaymentMethod.Cash)}>
                  {t("payments.method.cash")}
                </SelectItem>
                <SelectItem value={String(PaymentMethod.CreditCard)}>
                  {t("payments.method.creditCard")}
                </SelectItem>
                <SelectItem value={String(PaymentMethod.DebitCard)}>
                  {t("payments.method.debitCard")}
                </SelectItem>
                <SelectItem value={String(PaymentMethod.BankTransfer)}>
                  {t("payments.method.bankTransfer")}
                </SelectItem>
                <SelectItem value={String(PaymentMethod.Cheque)}>
                  {t("payments.method.cheque")}
                </SelectItem>
                <SelectItem value={String(PaymentMethod.Insurance)}>
                  {t("payments.method.insurance")}
                </SelectItem>
                <SelectItem value={String(PaymentMethod.Other)}>
                  {t("payments.method.other")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("payments.form.referenceNumber")}</Label>
            <Input {...form.register("referenceNumber")} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label>{t("payments.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
