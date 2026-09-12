import { useQuery } from "@tanstack/react-query";
import { fetchClinicProfile } from "../api/clinic";

export function useClinicProfile() {
  return useQuery({
    queryKey: ["clinic", "profile"],
    queryFn: fetchClinicProfile,
  });
}
