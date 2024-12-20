import { Router } from "express";

import { getMeHandler, getUsersHandler } from "../controllers/user.controller";
import authorize from "../middlewares/authorize.middleware";
import Audience from "../constants/audience.constants";

const userRouter = Router();

userRouter.get("/", authorize([Audience.Admin]), getUsersHandler);
userRouter.get("/me", authorize([Audience.User, Audience.Admin]), getMeHandler);

export default userRouter;
