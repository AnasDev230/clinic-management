import { useQuery } from "@tanstack/react-query";
import { fetchTodayAppointments } from "../api/appointments";

export function useTodayAppointments() {
  return useQuery({
    queryKey: ["appointments-today"],
    queryFn: () => fetchTodayAppointments(),
  });
}
