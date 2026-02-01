import type { Request, Response, NextFunction } from "express";
import { constants } from "http2";
import jwt from "jsonwebtoken";

import environmentVariables from "../environmentVariables";

import * as usersModel from "../models/usersModel";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearerToken = bearerHeader.split(" ")[1];
    if (bearerToken) {
      req.token = bearerToken;
      jwt.verify(
        bearerToken,
        environmentVariables.JWT_SECRET,
        async (error, decoded) => {
          if (error) {
            res
              .status(constants.HTTP_STATUS_FORBIDDEN)
              .json({ message: "Unauthorised access" });
          } else {
            // CKYTODO The serialized user is just the id for some reason it is outputing 1 currently
            // const user = await usersModel.getUserByUserId(Number(decoded));
            // if (user) {
            // req.user = user;
            // }
            next();
          }
        },
      );
    } else {
      res
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .json({ message: "Missing bearer token" });
    }
  } else {
    res
      .status(constants.HTTP_STATUS_FORBIDDEN)
      .json({ message: "You are not authorised" });
  }
};

export { authenticateToken };
