import { Router } from "express";

import * as usersController from "../controllers/usersController";

const authRouter = Router();

authRouter.get("/me", usersController.getCurrentUser);

export default authRouter;
