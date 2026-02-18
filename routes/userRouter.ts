import { Router } from "express";

import * as userController from "../controllers/userController";

const authRouter = Router();

authRouter.get("/me", userController.getCurrentUser);
authRouter.get("/", userController.getAllUsers);

export default authRouter;
