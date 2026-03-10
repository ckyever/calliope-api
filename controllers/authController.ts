import { hash } from "bcryptjs";
import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";
import { constants as httpConstants } from "http2";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import environmentVariables from "../environmentVariables";
import type { UserPayload } from "../types/jwt";

import * as userModel from "../models/userModel";

interface UserParams {
  username: string;
  password: string;
}

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
          let user = await userModel.getUserBySpotifyId(profile.id);

          if (user) {
            user = await userModel.updateUser(profile.id, profile.displayName);
          } else {
            user = await userModel.createUser({
              spotifyId: profile.id,
              username: null,
              displayName: profile.displayName,
              password: null,
            });
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
      const user = userModel.getUserByUserId(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

const handleSuccessfulAuth = async (req: Request, res: Response) => {
  const user = await res.locals.currentUser;
  jwt.sign(
    {
      id: user.id,
      spotifyId: user.spotifyId,
      displayName: user.displayName,
    } as UserPayload,
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

const validateCreateUser = [
  validator
    .body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
  validator.body("password").notEmpty().withMessage("Password is required"),
];

const createUser = [
  validateCreateUser,
  async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: "Invalid create user body", errors: errors.array() });
    }

    const { username, password } = validator.matchedData(req);

    if (await userModel.getUserByUsername(username)) {
      return res
        .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: "This username is not available" });
    }

    const SALT_ROUNDS = 10;
    const hashedPassword = await hash(password, SALT_ROUNDS);

    const newUser = await userModel.createUser({
      spotifyId: null,
      username: username,
      displayName: username,
      password: hashedPassword,
    });

    if (!newUser) {
      return res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to create a user" });
    }

    const secret: string = environmentVariables.JWT_SECRET;
    jwt.sign(
      { user: newUser },
      secret,
      { expiresIn: "1 days" },
      (error, token) => {
        if (error) {
          console.error(error);
          return res
            .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .json({ message: "Failed to get a token" });
        } else {
          const { password, ...userWithoutPassword } = newUser;
          return res
            .status(httpConstants.HTTP_STATUS_CREATED)
            .json({ user: userWithoutPassword, token });
        }
      },
    );
  },
];

const login = async (req: Request, res: Response) => {
  return res.json({ message: "CKYTODO Login" });
};

export { initialisePassportStrategy, handleSuccessfulAuth, createUser, login };
