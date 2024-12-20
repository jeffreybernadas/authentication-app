import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import {
  DISCORD_CALLBACK_DEV,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
} from "../constants/env.constants";
import UserModel, { UserDocument } from "../models/user.model";
import appAssert from "../utils/appAssert.util";
import { CONFLICT } from "../constants/http.constants";
import OAuth from "../constants/oAuthStrategies.constants";
import { oAuthCreateAccount, oAuthLoginUser } from "../services/auth.service";
import AppErrorCode from "../constants/appErrorCode.constants";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: UserReq, done) => {
  done(null, user);
});

const scopes = ["identify", "email"];

export type UserReq = {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
};

passport.use(
  new DiscordStrategy(
    {
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: DISCORD_CALLBACK_DEV,
      scope: scopes,
      passReqToCallback: true,
    },
    async (req, _access, _refresh, profile, done) => {
      let userExists;

      // Check if user exists. If an error occurs, throw the error.
      try {
        userExists = await UserModel.findOne({ email: profile.email });
      } catch (error) {
        return done(error, false);
      }
      const userStrategy = userExists?.oAuthStrategy;
      const correctStrategy = userExists?.oAuthStrategy === OAuth.Discord;

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
            email: profile.email as string,
            oAuthStrategy: OAuth.Discord,
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
