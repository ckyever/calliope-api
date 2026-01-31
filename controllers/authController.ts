import "dotenv/config";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import environmentVariables from "../environmentVariables";

import * as usersModel from "../models/usersModel";

const initialisePassportStrategy = () => {
  passport.use(
    new SpotifyStrategy(
      {
        clientID: environmentVariables.SPOTIFY_CLIENT_ID,
        clientSecret: environmentVariables.SPOTIFY_SECRET,
        callbackURL: environmentVariables.SPOTIFY_CALLBACK_URL,
      },
      async (accessToken, refreshToken, expires_in, profile, done) => {
        try {
          let user = await usersModel.getUserBySpotifyId(profile.id);

          if (user) {
            user = await usersModel.updateUser(profile.id, profile.displayName);
          } else {
            user = await usersModel.createUser(profile.id, profile.displayName);
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      },
    ),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = usersModel.getUserByUserId(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

const handleSuccessfulAuth = async (req: Request, res: Response) => {
  const user = res.locals.currentUser;
  jwt.sign(
    { user },
    environmentVariables.JWT_SECRET,
    { expiresIn: "1 days" },
    async (error, token) => {
      if (error) {
        console.error(error);
        return res.redirect(
          `${environmentVariables.FRONTEND_REDIRECT_URL}/?error=failed`,
        );
      }
      return res.redirect(
        `${environmentVariables.FRONTEND_REDIRECT_URL}/?token=${token}`,
      );
    },
  );
};

export { initialisePassportStrategy, handleSuccessfulAuth };
