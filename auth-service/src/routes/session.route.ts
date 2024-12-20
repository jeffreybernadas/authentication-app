import { Router } from "express";
import {
  deleteSessionHandler,
  getSessionHandler,
} from "../controllers/session.controller";

const sessionRouter = Router();

sessionRouter.get("/", getSessionHandler);
sessionRouter.delete("/:id", deleteSessionHandler);

export default sessionRouter;
