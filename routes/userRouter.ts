import { Router } from "express";

import { getUser } from "../controllers/userController";

const authRouter = Router();

authRouter.get("/", getUser);

export default authRouter;
