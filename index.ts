import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { prisma } from "./lib/prisma";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import environmentVariables from "./environmentVariables";
import { authenticateToken } from "./middleware/authenticateToken";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";

import * as authenticationController from "./controllers/authController";

const app = express();

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: true,
    }),
    secret: environmentVariables.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

authenticationController.initialisePassportStrategy();

app.get("/", (request: Request, response: Response) =>
  response.send("Welcome to the Calliope API!"),
);

// Unprotected Routes
app.use("/api/auth", authRouter);

// Protected Routes
app.use(authenticateToken);
app.use("/api/user", userRouter);

app.listen(environmentVariables.PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App started on ${new Date()}`);
});
