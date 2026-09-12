import { useQuery } from "@tanstack/react-query";
import { fetchClinicSettings } from "../api/clinic";

export function useClinicSettings() {
  return useQuery({
    queryKey: ["clinic", "settings"],
    queryFn: fetchClinicSettings,
  });
}
