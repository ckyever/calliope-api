import { Router } from "express";
import passport from "passport";

import environmentVariables from "../environmentVariables";

import * as authController from "../controllers/authController";

const authRouter = Router();

authRouter.get("/spotify", passport.authenticate("spotify"));
authRouter.get(
  "/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: `${environmentVariables.FRONTEND_REDIRECT_URL}/?error=failed`,
  }),
  authController.handleSuccessfulAuth,
);

export default authRouter;
