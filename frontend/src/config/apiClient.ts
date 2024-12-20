import { ApiError } from "@/utils/ApiError";
import axios from "axios";
import queryClient from "./queryClient";
import { navigate } from "@/lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

// Create a new axios instance for token refresh. This instance does not have an interceptor to avoid an infinite loop.
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create({ ...options });

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};

    // Refresh token if status is 401
    if (status === 401 && data.data.errorCode === "InvalidAccessToken") {
      try {
        // Get new access token
        await API.get("/api/v1/auth/refresh");
        // Retry the original request
        return TokenRefreshClient(config);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        queryClient.clear();
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }
    // Reject the promise with custom error object
    return Promise.reject(new ApiError(status, data));
  }
);

export default API;
