import { useQuery } from "@tanstack/react-query";
import { fetchDoctorsDropdown } from "../api/doctors";

export function useDoctorsDropdown() {
  return useQuery({
    queryKey: ["doctors-dropdown"],
    queryFn: fetchDoctorsDropdown,
  });
}
