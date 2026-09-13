import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchAppointmentsList,
  type FetchAppointmentsParams,
} from "../api/appointments";

export function useAppointments(params: FetchAppointmentsParams) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => fetchAppointmentsList(params),
    placeholderData: keepPreviousData,
  });
}
