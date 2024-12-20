/**
 * Extended Error class for API errors
 * It contains the status code and the response data
 * Errors thrown by the API client will be of this type
 * error.response will contain the ResDataType object
 */

type ResDataType = {
  status: number;
  service: string;
  appVersion: string;
  method: string;
  timestamp: Date;
  responseTime: string;
  url: string;
  data: {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
  };
};

export class ApiError extends Error {
  status: number;
  response: ResDataType;

  constructor(status: number, response: ResDataType) {
    super(`API Error: ${response.data.message}`);
    this.status = status;
    this.response = response;
  }
}
