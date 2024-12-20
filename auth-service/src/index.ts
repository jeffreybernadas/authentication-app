import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import connectToDatabase from "./config/db.config";

import { APP_ORIGIN, APP_ORIGIN_DEV, NODE_ENV, PORT } from "./constants/env.constants";
import { apiBaseUrl } from "./constants/version.constants";
import { OK } from "./constants/http.constants";

import errorHandler from "./middlewares/errorHandler.middleware";
import enhancedResponse from "./middlewares/enhancedResponse.middleware";
import authenticate from "./middlewares/authenticate.middlware";

import { logger } from "./utils/logger.util";
import swaggerDocs from "./utils/swagger.util";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import sessionRouter from "./routes/session.route";

import "./strategies/discord.strategy";
import "./strategies/google.strategy";
import "./strategies/facebook.strategy";
import "./strategies/github.strategy";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
// Initialize Swagger Docs
swaggerDocs(app, PORT);
app.use(enhancedResponse);
// Init Passport for OAuth2.0
app.use(passport.initialize());

app.get("/healthCheck", (_, res) => {
  res.status(OK).json({
    status: "Auth Service is healthy.",
  });
});
app.use(`${apiBaseUrl}/auth`, authRouter);
app.use(`${apiBaseUrl}/user`, authenticate, userRouter);
app.use(`${apiBaseUrl}/session`, authenticate, sessionRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  logger.info(
    `Auth Service is running on port ${PORT} in ${NODE_ENV} environment.`,
  );
  await connectToDatabase();
});
