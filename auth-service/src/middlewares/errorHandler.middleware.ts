import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../constants/http.constants";
import AppError from "../utils/AppError.util";
import { apiBaseUrl } from "../constants/version.constants";
import { clearAuthCookies } from "../utils/cookies.utils";
import { logger } from "../utils/logger.util";
import AppErrorCode from "../constants/appErrorCode.constants";
import { APP_ORIGIN, APP_ORIGIN_DEV, NODE_ENV } from "../constants/env.constants";

const handleZodError = (res: Response, error: ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return res.status(BAD_REQUEST).json({
    message: "Bad Request.",
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`PATH: ${req.path}`, error);
  const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;

  if (req.path === `${apiBaseUrl}/auth/refresh`) {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    handleZodError(res, error);
  }

  if (
    error instanceof AppError &&
    error.errorCode === AppErrorCode.InvalidLoginMethod
  ) {
    res.redirect(`${origin}?error=${encodeURIComponent(error.message)}`);
  }

  if (error instanceof AppError) {
    handleAppError(res, error);
  }

  res.status(INTERNAL_SERVER_ERROR).json({ message: "Something went wrong." });
};

export default errorHandler;
