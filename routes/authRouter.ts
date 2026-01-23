import { Router } from "express";
import type { Request, Response } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get("/spotify", passport.authenticate("spotify"));
authRouter.get(
  "/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/?error=failed" }),
  async (request: Request, response: Response) => {
    response.redirect("/");
  },
);

export default authRouter;
