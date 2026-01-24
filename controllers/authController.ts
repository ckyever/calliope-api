import "dotenv/config";
import type { Request, Response } from "express";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import * as usersModel from "../models/usersModel";

const REDIRECT_URL = process.env.FRONTEND_REDIRECT_URL;

if (!REDIRECT_URL) {
  throw Error("Missing environment variable - frontend redirect URL");
}

const initialisePassportStrategy = () => {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;
  const SPOTIFY_CALLBACK_URL = process.env.SPOTIFY_CALLBACK_URL;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_SECRET || !SPOTIFY_CALLBACK_URL) {
    throw Error("Missing Spotify API credentials");
  }

  passport.use(
    new SpotifyStrategy(
      {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_SECRET,
        callbackURL: SPOTIFY_CALLBACK_URL,
      },
      async (accessToken, refreshToken, expires_in, profile, done) => {
        try {
          let user = await usersModel.getUserBySpotifyId(profile.id);

          if (!user) {
            user = await usersModel.createUser(profile.id);
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
  console.log(res.locals.currentUser);
  res.redirect(REDIRECT_URL);
};

export { initialisePassportStrategy, handleSuccessfulAuth };
