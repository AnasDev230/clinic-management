"use client";

import { forwardRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { InvoiceDetail } from "@/types/invoice";

interface InvoicePrintViewProps {
  data: InvoiceDetail;
  clinicName?: string;
}

export const InvoicePrintView = forwardRef<HTMLDivElement, InvoicePrintViewProps>(
  function InvoicePrintView({ data, clinicName }, ref) {
    const { t, language } = useTranslation();

    return (
      <div ref={ref} className="space-y-6 bg-white p-8 text-black print:p-0">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold">{clinicName ?? t("app.name")}</h1>
          <p className="text-sm text-gray-600">{t("invoices.printTitle")}</p>
          <p className="font-mono text-sm tabular-nums">{data.invoiceNumber}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">{t("invoices.table.patient")}: </span>
            {data.patientName}
          </div>
          <div>
            <span className="font-semibold">{t("invoices.table.date")}: </span>
            <span className="tabular-nums">{formatDate(data.invoiceDate, language)}</span>
          </div>
          {data.dueDate && (
            <div>
              <span className="font-semibold">{t("invoices.table.dueDate")}: </span>
              <span className="tabular-nums">{formatDate(data.dueDate, language)}</span>
            </div>
          )}
          {data.doctorName && (
            <div>
              <span className="font-semibold">{t("invoices.form.doctor")}: </span>
              {data.doctorName}
            </div>
          )}
        </div>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-start">#</th>
              <th className="border p-2 text-start">{t("invoices.items.service")}</th>
              <th className="border p-2 text-start">{t("invoices.items.quantity")}</th>
              <th className="border p-2 text-start">{t("invoices.items.unitPrice")}</th>
              <th className="border p-2 text-start">{t("invoices.items.discount")}</th>
              <th className="border p-2 text-start">{t("invoices.items.total")}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={item.id}>
                <td className="border p-2 tabular-nums">{i + 1}</td>
                <td className="border p-2 font-medium">{item.serviceName}</td>
                <td className="border p-2 tabular-nums">{item.quantity}</td>
                <td className="border p-2 tabular-nums">
                  {formatCurrency(item.unitPrice, language)}
                </td>
                <td className="border p-2 tabular-nums">
                  {formatCurrency(item.discountAmount, language)}
                </td>
                <td className="border p-2 tabular-nums">
                  {formatCurrency(item.totalAmount, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ms-auto w-64 space-y-1 text-sm">
          <div className="flex justify-between gap-2">
            <span>{t("invoices.summary.subTotal")}</span>
            <span className="tabular-nums">{formatCurrency(data.subTotal, language)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>{t("invoices.summary.discount")}</span>
            <span className="tabular-nums">{formatCurrency(data.discountAmount, language)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>{t("invoices.summary.tax")}</span>
            <span className="tabular-nums">{formatCurrency(data.taxAmount, language)}</span>
          </div>
          <div className="flex justify-between gap-2 border-t pt-1 font-bold">
            <span>{t("invoices.summary.total")}</span>
            <span className="tabular-nums">{formatCurrency(data.totalAmount, language)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>{t("invoices.summary.paid")}</span>
            <span className="tabular-nums">{formatCurrency(data.paidAmount, language)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>{t("invoices.summary.remaining")}</span>
            <span className="tabular-nums">{formatCurrency(data.remainingAmount, language)}</span>
          </div>
        </div>
        {data.notes && <p className="text-sm">{data.notes}</p>}
      </div>
    );
  },
);
