import API from "@/config/apiClient";

export type ResponseDataType = {
  service: string;
  appVersion: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: number;
  timestamp: Date;
  responseTime: string;
  url: string;
  data: {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
  };
};
export type LoginDataType = {
  email: string;
  password: string;
};
export type RegisterDataType = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type ResetPasswordDataType = {
  verificationCode: string;
  password: string;
};

export const login = async (data: LoginDataType) =>
  API.post("/api/v1/auth/login", data);
export const logout = async () => API.get("/api/v1/auth/logout");
export const register = async (data: RegisterDataType) =>
  API.post("/api/v1/auth/register", data);

export const verifyEmail = async (code: string) =>
  API.get(`/api/v1/auth/email/verify/${code}`);
export const forgotPassword = async (email: string) =>
  API.post(`/api/v1/auth/password/forgot`, { email });
export const resetPassword = async (data: ResetPasswordDataType) =>
  API.post(`/api/v1/auth/password/reset`, data);

export const getMe = async () => API.get(`/api/v1/user/me`);
export const getSessions = async () => API.get(`/api/v1/session`);
export const deleteSession = async (id: string) =>
  API.delete(`/api/v1/session/${id}`);

export const getUsers = async (queryString: string) =>
  API.get(`/api/v1/user${queryString}`);
