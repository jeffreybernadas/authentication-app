import AppErrorCode from "../constants/appErrorCode.constants";
import { HttpStatusCode } from "../constants/http.constants";

/**
 * Represents an application-specific error.
 * Extends the built-in Error class to include additional properties.
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   *
   * @param {HttpStatusCode} statusCode - The HTTP status code associated with the error.
   * @param {string} message - A descriptive message explaining the error.
   * @param {AppErrorCode} [errorCode] - An optional application-specific error code.
   */
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode,
  ) {
    super(message);
  }
}

export default AppError;
