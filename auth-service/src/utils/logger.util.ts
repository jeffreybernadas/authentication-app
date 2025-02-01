import winston, { format, transports } from "winston";
import app from "../../package.json";

const { combine, timestamp, prettyPrint, json } = format;

/**
 * @description Ignore log messages if they have { private: true }
 * @usage logger.log({ private: true, message: "This message will not be logged." });
 */
const ignorePrivate = format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    ignorePrivate(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    json(),
    prettyPrint(),
  ),
  defaultMeta: { service: `${app.name}`, appVersion: `v${app.version}` },
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/warn.log", level: "warn" }),
    new transports.File({ filename: "logs/info.log", level: "info" }),
    new transports.File({ filename: "logs/http.log", level: "http" }),
    new transports.File({ filename: "logs/verbose.log", level: "verbose" }),
    new transports.File({ filename: "logs/debug.log", level: "debug" }),
    new transports.File({ filename: "logs/silly.log", level: "silly" }),
    new transports.File({ filename: "logs/app.log" }),
  ],
});
