import "dotenv/config";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import * as usersModel from "../models/usersModel";

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
          const user = await usersModel.getUserBySpotifyId(profile.id);

          if (!user) {
            return done(Error("Account does not exist"));
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

export { initialisePassportStrategy };
