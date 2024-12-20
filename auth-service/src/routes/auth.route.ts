import { Router } from "express";
import passport from "passport";
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
  passwordResetHandler,
  discordHandler,
  googleHandler,
  facebookHandler,
  githubHandlerHandler,
} from "../controllers/auth.controller";
import { APP_ORIGIN, APP_ORIGIN_DEV, NODE_ENV } from "../constants/env.constants";

const authRouter = Router();
const origin = NODE_ENV === "development" ? APP_ORIGIN_DEV : APP_ORIGIN;

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/refresh", refreshHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/email/verify/:code", verifyEmailHandler);
authRouter.post("/password/forgot", sendPasswordResetHandler);
authRouter.post("/password/reset", passwordResetHandler);

// Strategies
authRouter.get("/discord", passport.authenticate("discord"));
authRouter.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: origin,
    session: false,
  }),
  discordHandler,
);
authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: origin,
    session: false,
  }),
  googleHandler,
);
authRouter.get("/facebook", passport.authenticate("facebook"));
authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: origin,
    session: false,
  }),
  facebookHandler,
);
authRouter.get("/github", passport.authenticate("github"));
authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: origin,
    session: false,
  }),
  githubHandlerHandler,
);

export default authRouter;
