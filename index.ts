import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import passport from "passport";
import session from "express-session";

const app = express();

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw Error("Missing session secret environment variable");
}

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (request: Request, response: Response) =>
  response.send("Welcome to the Calliope API!"),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App started on ${new Date()}`);
});
