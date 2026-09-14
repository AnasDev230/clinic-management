import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchAttachmentsList,
  type FetchAttachmentsParams,
} from "../api/attachments";

export function useAttachments(params: FetchAttachmentsParams) {
  return useQuery({
    queryKey: ["attachments", "list", params],
    queryFn: () => fetchAttachmentsList(params),
    placeholderData: keepPreviousData,
  });
}
