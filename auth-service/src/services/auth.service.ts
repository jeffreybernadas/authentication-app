import _ from "lodash";
import VerificationCodeType from "../constants/verificationCode.constants";
import SessionModel from "../models/session.model";
import UserModel, { UserDocument } from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http.constants";
import { apiBaseUrl } from "../constants/version.constants";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/date.util";
import appAssert from "../utils/appAssert.util";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt.util";
import { sendMail } from "../utils/sendMail.util";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates.util";
import { logger } from "../utils/logger.util";
import { hashValue } from "../utils/bcrypt.util";
import {
  NODE_ENV,
  APP_ORIGIN_DEV,
  APP_ORIGIN,
} from "../constants/env.constants";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // Check user if it doesn't exist
  const existingUser = await UserModel.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, "Email already in use.");

  // Create User
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  return await createUserAndCreateSession(user, data.userAgent);
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async (data: LoginParams) => {
  // Find user by email
  const user = await UserModel.findOne({ email: data.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password.");

  // Validate password
  const isPasswordCorrect = await user.comparePassword(data.password);
  appAssert(isPasswordCorrect, UNAUTHORIZED, "Invalid email or password.");

  return await loginAndCreateSession(user, data.userAgent);
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token.");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  const sessionIsExpired = session && session.expiresAt.getTime() > now;

  if (!sessionIsExpired) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }
  appAssert(sessionIsExpired, UNAUTHORIZED, "Session expired.");

  // Refresh session of token expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now < ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        { sessionId: session._id, userRole: payload.userRole },
        refreshTokenSignOptions,
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    userRole: payload.userRole,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code: string) => {
  // get verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code.");
  // get user by id and update user verified to true
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true },
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email.");
  // delete verification code
  await validCode.deleteOne();
  // return user
  return _.omit(updatedUser.toObject(), ["password"]);
};

export const sendPasswordResetEmail = async (email: string) => {
  const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;
  // Catch any errors that were thrown and log them (but always return a success)
  // This will prevent leaking sensitive data back to the client (e.g. user not found, email not sent).

  // get user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, "User not found.");

  // check for max password reset requests (2 emails in 5min)
  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo },
  });
  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "Too many requests, please try again later.",
  );
  // create verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt: expiresAt,
  });
  // send verification email
  const emailUrl = `${origin}${apiBaseUrl}/auth/password/reset?code=${verificationCode._id}&expiresAt=${expiresAt.getTime()}`;

  // Send verification email
  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(emailUrl),
  });
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`,
  );

  // return success message
  return { emailUrl, emailId: data.id };
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPasswordParams) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

  await validCode.deleteOne();

  // delete all sessions
  await SessionModel.deleteMany({ userId: validCode.userId });

  return { user: _.omit(updatedUser.toObject(), ["password"]) };
};

export type OAuthCreateAccountParams = {
  email: string;
  oAuthStrategy: string;
  userAgent?: string;
};

export const oAuthCreateAccount = async (data: OAuthCreateAccountParams) => {
  // Create User
  const user = await UserModel.create({
    email: data.email,
    oAuthStrategy: data.oAuthStrategy,
  });

  return await createUserAndCreateSession(user, data.userAgent);
};

export type OAuthoginParams = {
  user: UserDocument;
  userAgent?: string;
};

export const oAuthLoginUser = async (data: OAuthoginParams) => {
  return await loginAndCreateSession(data.user, data.userAgent);
};

export const createUserAndCreateSession = async (
  userData: UserDocument,
  userAgent?: string,
) => {
  // Create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId: userData._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const emailUrl = `${origin}${apiBaseUrl}/auth/email/verify/${verificationCode._id}`;

  // Send verification email
  const { error } = await sendMail({
    to: userData.email,
    ...getVerifyEmailTemplate(emailUrl),
  });

  // Ignore email errors for now
  if (error) logger.error(error);

  // Create session
  const session = await SessionModel.create({
    userId: userData._id,
    userAgent: userAgent,
  });

  // Sign access & refresh token
  const refreshToken = signToken(
    { sessionId: session._id, userRole: userData.role },
    refreshTokenSignOptions,
  );
  const accessToken = signToken({
    userId: userData._id,
    userRole: userData.role,
    sessionId: session._id,
  });

  // Return user & tokens
  return {
    user: _.omit(userData.toObject(), ["password"]),
    accessToken,
    refreshToken,
  };
};

export const loginAndCreateSession = async (
  user: UserDocument,
  userAgent?: string,
) => {
  // Create a session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: userAgent,
  });

  // Sign access & refresh token
  const refreshToken = signToken(
    { sessionId: session._id, userRole: user.role },
    refreshTokenSignOptions,
  );
  const accessToken = signToken({
    userId: user._id,
    userRole: user.role,
    sessionId: session._id,
  });

  // Return user & tokens
  return {
    user: _.omit(user.toObject(), ["password"]),
    accessToken,
    refreshToken,
  };
};
