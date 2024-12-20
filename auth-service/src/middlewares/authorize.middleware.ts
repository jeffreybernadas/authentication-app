import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt.util";
import appAssert from "../utils/appAssert.util";

import { FORBIDDEN, UNAUTHORIZED } from "../constants/http.constants";
import AppErrorCode from "../constants/appErrorCode.constants";
import Audience from "../constants/audience.constants";

const authorize = (roles: Audience[] = [Audience.Admin]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken as string;
    const { error, payload } = verifyToken(accessToken);
    appAssert(
      payload,
      UNAUTHORIZED,
      error === "jwt expired" ? "Token expired." : "Invalid token.",
      AppErrorCode.InvalidAccessToken,
    );

    const hasRole = roles.includes(payload.userRole);
    appAssert(
      hasRole,
      FORBIDDEN,
      "Forbidden Request.",
      AppErrorCode.InsufficientRole,
    );

    next();
  };
};

export default authorize;
