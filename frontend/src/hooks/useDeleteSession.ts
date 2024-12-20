import { deleteSession } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SESSION_KEY,
  SessionDataType,
  SessionDataTypeResponse,
} from "./useSessions";

const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData(
        [SESSION_KEY],
        (cache: SessionDataTypeResponse) => {
          return {
            ...cache,
            data: cache.data.filter(
              (session: SessionDataType) => session._id !== sessionId
            ),
          };
        }
      );
    },
  });

  return { deleteSession: mutate, ...rest };
};

export default useDeleteSession;
