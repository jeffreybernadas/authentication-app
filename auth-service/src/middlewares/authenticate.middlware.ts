import { RequestHandler } from "express";
import mongoose from "mongoose";

import { verifyToken } from "../utils/jwt.util";
import appAssert from "../utils/appAssert.util";

import { UNAUTHORIZED } from "../constants/http.constants";
import AppErrorCode from "../constants/appErrorCode.constants";

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authenticated.",
    AppErrorCode.InvalidAccessToken,
  );
  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired." : "Invalid token.",
    AppErrorCode.InvalidAccessToken,
  );

  /**
   * Add userId and sessionId to the request object.
   * This will be used in the subsequent middlewares or controller to perform
   */
  req.userId = payload.userId as mongoose.Types.ObjectId;
  req.sessionId = payload.sessionId as mongoose.Types.ObjectId;
  next();
};

export default authenticate;
