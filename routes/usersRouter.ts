import { Router } from "express";

import * as usersController from "../controllers/usersController";

const authRouter = Router();

authRouter.get("/me", usersController.getCurrentUser);
authRouter.get("/", usersController.getAllUsers);

export default authRouter;
