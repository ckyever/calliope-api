import { Router } from "express";
import type { Request, Response } from "express";
import passport from "passport";

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
  async (request: Request, response: Response) => {
    response.redirect(REDIRECT_URL);
  },
);

export default authRouter;
