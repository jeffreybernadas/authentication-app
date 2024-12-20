import jwt, { SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.constants";
import Audience from "../constants/audience.constants";

export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  userRole: UserDocument["role"];
  sessionId: SessionDocument["_id"];
};

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
  userRole: UserDocument["role"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: [Audience.User],
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOpts } = options ?? accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

export const verifyToken = <T extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options ?? {};
  try {
    const payload = verify(token, secret, { ...defaults, ...verifyOpts }) as T;
    return { payload };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
