import "dotenv/config";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import * as usersModel from "../models/usersModel";

const initialisePassportStrategy = () => {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_SECRET) {
    throw Error("Missing Spotify API credentials");
  }

  passport.use(
    new SpotifyStrategy(
      {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_SECRET,
        callbackURL: "http://localhost:8888/auth/spotify/callback",
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
};

export { initialisePassportStrategy };
