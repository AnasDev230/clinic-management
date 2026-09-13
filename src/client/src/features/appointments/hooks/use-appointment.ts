import { useQuery } from "@tanstack/react-query";
import { fetchAppointment } from "../api/appointments";

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => fetchAppointment(id),
    enabled: Boolean(id),
  });
}
