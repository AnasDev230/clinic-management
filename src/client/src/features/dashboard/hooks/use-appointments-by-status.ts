import { useQuery } from "@tanstack/react-query";
import { fetchAppointmentsByStatus } from "../api/dashboard";

export function useAppointmentsByStatus(
  from: string,
  to: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard-appointments-by-status", from, to],
    queryFn: () => fetchAppointmentsByStatus(from, to),
    enabled,
  });
}
