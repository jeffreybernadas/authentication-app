import catchErrors from "../utils/catchErrors.util";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http.constants";
import { APP_ORIGIN, APP_ORIGIN_DEV, NODE_ENV } from "../constants/env.constants";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies.utils";
import {
  emailSchema,
  loginSchema,
  passwordResetSchema,
  registerSchema,
  verificationCodeSchema,
} from "../schemas/auth.schemas";
import { AccessTokenPayload, verifyToken } from "../utils/jwt.util";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert.util";
import { UserReq } from "../strategies/discord.strategy";

export const registerHandler = catchErrors(async (req, res) => {
  // Validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // Call Service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // Return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  //Validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // Call Service
  const { accessToken, refreshToken } = await loginUser(request);
  // Return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login successful." });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken<AccessTokenPayload>(accessToken ?? "");

  if (payload) {
    // Delete session
    await SessionModel.findByIdAndDelete(payload.sessionId);

    return clearAuthCookies(res)
      .status(OK)
      .json({ message: "Logout successful." });
  } else {
    return res.status(UNAUTHORIZED).json({ message: "Not authenticated." });
  }
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Refresh token is missing.");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed." });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email successfully verified." });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  return res.status(OK).json({ message: "Password reset email sent." });
});

export const passwordResetHandler = catchErrors(async (req, res) => {
  const request = passwordResetSchema.parse(req.body);

  await resetPassword(request);

  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Password reset successful." });
});

export const discordHandler = catchErrors(async (req, res) => {
  const { accessToken, refreshToken } = req.user as UserReq;
  const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .redirect(`${origin}/`);
});

export const googleHandler = catchErrors(async (req, res) => {
  const { accessToken, refreshToken } = req.user as UserReq;
  const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .redirect(`${origin}/`);
});

export const facebookHandler = catchErrors(async (req, res) => {
  const { accessToken, refreshToken } = req.user as UserReq;
  const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .redirect(`${origin}/`);
});

export const githubHandlerHandler = catchErrors(async (req, res) => {
  const { accessToken, refreshToken } = req.user as UserReq;
  const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .redirect(`${origin}/`);
});
