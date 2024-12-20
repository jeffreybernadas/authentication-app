import { getSessions, ResponseDataType } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const SESSION_KEY = "sessions";

export type SessionDataTypeResponse = {
  service: string;
  appVersion: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime: string;
  url: string;
  data: SessionDataType[];
};

export type SessionDataType = {
  _id: string;
  userAgent: string;
  createdAt: string;
  isCurrent?: boolean;
};

const useSession = (opts = {}) => {
  const { data: res, ...rest } = useQuery<
    unknown,
    ResponseDataType,
    SessionDataTypeResponse
  >({
    queryKey: [SESSION_KEY],
    queryFn: getSessions,
    ...opts,
  });
  const sessions = res?.data;
  return { sessions, ...rest };
};

export default useSession;
