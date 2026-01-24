import { Router } from "express";
import type { Request, Response } from "express";
import passport from "passport";

import * as authController from "../controllers/authenticationController";

const authRouter = Router();

const REDIRECT_URL = process.env.FRONTEND_REDIRECT_URL;

if (!REDIRECT_URL) {
  throw Error("Missing environment variable - frontend redirect URL");
}

authRouter.get("/spotify", passport.authenticate("spotify"));
authRouter.get(
  "/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: `${REDIRECT_URL}/?error=failed`,
  }),
  authController.handleSuccessfulAuth,
);

export default authRouter;
