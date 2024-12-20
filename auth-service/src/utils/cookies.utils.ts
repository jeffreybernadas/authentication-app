import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env.constants";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.util";
import { apiBaseUrl } from "../constants/version.constants";

// Note: secure is true in production, false in development
// Note: sameSite is strict in development, none in production
// Note that the sameSite is set to none in production because the frontend and backend are running on different domains. 
// If the frontend and backend are running on the same domain, the sameSite should be set to strict. (Mainly in development or VPS.)
const secure = NODE_ENV !== "development";
const sameSite = NODE_ENV === "development" ? "strict" : "none";
export const REFRESH_PATH = "/auth/refresh";

// Set the default cookie options
const defaults: CookieOptions = {
  sameSite,
  httpOnly: true,
  secure,
};

// Get the cookie options for the access token including a predefined expiration time of 15 minutes
export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

// Get the cookie options for the refresh token including a predefined expiration time of 30 days
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: `${apiBaseUrl}${REFRESH_PATH}`,
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

// Set the access and refresh tokens as cookies
export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

// Clear the access and refresh tokens from cookies
export const clearAuthCookies = (res: Response) => {
  return res
    .clearCookie("accessToken", {
      path: "/",
      secure,
      sameSite,
    })
    .clearCookie("refreshToken", {
      path: apiBaseUrl + REFRESH_PATH,
      secure,
      sameSite,
    });
};
