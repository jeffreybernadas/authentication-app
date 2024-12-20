import { getMe, ResponseDataType } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const AUTH_KEY = "auth";

export type AuthDataTypeResponse = {
  service: string;
  appVersion: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime: string;
  url: string;
  data: AuthDataType;
};

export type AuthDataType = {
  _id: string;
  email: string;
  verified: boolean;
  role: "User" | "Admin";
  oAuthStrategy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const useAuth = (opts = {}) => {
  const { data: res, ...rest } = useQuery<
    unknown,
    ResponseDataType,
    AuthDataTypeResponse
  >({
    queryKey: [AUTH_KEY],
    queryFn: getMe,
    // Cache the user data for 24 hours
    staleTime: Infinity, // Call useAuth again after the specified time or just put _Infinity_
    ...opts,
  });
  const user = res?.data;
  return { user, ...rest };
};

export default useAuth;
