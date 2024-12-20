import passport from "passport";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_DEV,
} from "../constants/env.constants";
import UserModel, { UserDocument } from "../models/user.model";
import appAssert from "../utils/appAssert.util";
import { CONFLICT } from "../constants/http.constants";
import OAuth from "../constants/oAuthStrategies.constants";
import { oAuthCreateAccount, oAuthLoginUser } from "../services/auth.service";
import AppErrorCode from "../constants/appErrorCode.constants";
import { Request } from "express";
import { VerifyCallback } from "passport-oauth2";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: UserReq, done) => {
  done(null, user);
});

export type UserReq = {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
};

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_DEV,
      passReqToCallback: true,
    },
    async (
      req: Request,
      _access: string,
      _refresh: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      let userExists;
      // Check if user exists. If an error occurs, throw the error.
      if (!profile.emails || profile.emails.length === 0) {
        return done(
          new Error(
            "Email not found in Github profile. Please provide an email in the platform.",
          ),
          false,
        );
      }
      try {
        userExists = await UserModel.findOne({
          email: profile.emails[0].value,
        });
      } catch (error) {
        return done(error, false);
      }
      const userStrategy = userExists?.oAuthStrategy;
      const correctStrategy = userExists?.oAuthStrategy === OAuth.Github;

      try {
        // If user exists, check if the user is using the correct login method.
        if (userExists) {
          appAssert(
            correctStrategy,
            CONFLICT,
            `Email already used with different login method. Please do ${userStrategy} login.`,
            AppErrorCode.InvalidLoginMethod,
          );
          const reqData = {
            user: userExists,
            userAgent: req.headers["user-agent"],
          };
          // If user exists, login the user.
          const data = await oAuthLoginUser(reqData);
          return done(null, data);
          // If user does not exist, create a new account.
        } else {
          const reqData = {
            email: profile.emails[0].value,
            oAuthStrategy: OAuth.Github,
            userAgent: req.headers["user-agent"],
          };
          const data = await oAuthCreateAccount(reqData);
          return done(null, data);
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
