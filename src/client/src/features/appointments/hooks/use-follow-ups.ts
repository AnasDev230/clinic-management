import { useQuery } from "@tanstack/react-query";
import { fetchFollowUps } from "../api/follow-ups";

export function useFollowUps(appointmentId: string) {
  return useQuery({
    queryKey: ["follow-ups", appointmentId],
    queryFn: () => fetchFollowUps(appointmentId),
    enabled: Boolean(appointmentId),
  });
}
