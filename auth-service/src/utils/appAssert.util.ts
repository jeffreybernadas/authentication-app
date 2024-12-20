import assert from "node:assert";
import { HttpStatusCode } from "../constants/http.constants";
import AppErrorCode from "../constants/appErrorCode.constants";
import AppError from "./AppError.util";

type AppAssert = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode,
) => asserts condition;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */
const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode,
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
