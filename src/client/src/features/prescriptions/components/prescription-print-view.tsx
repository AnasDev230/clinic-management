"use client";

import { forwardRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import type { PrescriptionDetail } from "@/types/prescription";

interface PrescriptionPrintViewProps {
  data: PrescriptionDetail;
  clinicName?: string;
}

export const PrescriptionPrintView = forwardRef<HTMLDivElement, PrescriptionPrintViewProps>(
  function PrescriptionPrintView({ data, clinicName }, ref) {
    const { t, language } = useTranslation();

    return (
      <div ref={ref} className="space-y-6 bg-white p-8 text-black print:p-0">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold">{clinicName ?? t("app.name")}</h1>
          <p className="text-sm text-gray-600">{t("prescriptions.printTitle")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">{t("prescriptions.table.patient")}: </span>
            {data.patientName}
          </div>
          <div>
            <span className="font-semibold">{t("prescriptions.table.doctor")}: </span>
            {data.doctorName}
          </div>
          <div>
            <span className="font-semibold">{t("prescriptions.table.date")}: </span>
            <span className="tabular-nums">{formatDate(data.prescriptionDate, language)}</span>
          </div>
          {data.validUntil && (
            <div>
              <span className="font-semibold">{t("prescriptions.validUntil")}: </span>
              <span className="tabular-nums">{formatDate(data.validUntil, language)}</span>
            </div>
          )}
        </div>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-start">#</th>
              <th className="border p-2 text-start">{t("prescriptions.items.medication")}</th>
              <th className="border p-2 text-start">{t("prescriptions.items.dosage")}</th>
              <th className="border p-2 text-start">{t("prescriptions.items.frequency")}</th>
              <th className="border p-2 text-start">{t("prescriptions.items.duration")}</th>
              <th className="border p-2 text-start">{t("prescriptions.items.instructions")}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={item.id}>
                <td className="border p-2 tabular-nums">{i + 1}</td>
                <td className="border p-2 font-medium">{item.medicationName}</td>
                <td className="border p-2">{item.dosage ?? "—"}</td>
                <td className="border p-2">{item.frequency ?? "—"}</td>
                <td className="border p-2">{item.duration ?? "—"}</td>
                <td className="border p-2">{item.instructions ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.notes && <p className="text-sm">{data.notes}</p>}
      </div>
    );
  },
);
