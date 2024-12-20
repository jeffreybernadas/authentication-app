import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_DEV,
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

export type UserReq = {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_DEV,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, _access, _refresh, profile, done) => {
      let userExists;
      // Check if user exists. If an error occurs, throw the error.
      try {
        userExists = await UserModel.findOne({ email: profile._json.email });
      } catch (error) {
        return done(error, false);
      }
      const userStrategy = userExists?.oAuthStrategy;
      const correctStrategy = userExists?.oAuthStrategy === OAuth.Google;

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
            email: profile._json.email as string,
            oAuthStrategy: OAuth.Google,
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
