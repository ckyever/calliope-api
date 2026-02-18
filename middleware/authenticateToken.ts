import type { Request, Response, NextFunction } from "express";
import { constants } from "http2";
import jwt from "jsonwebtoken";

import environmentVariables from "../environmentVariables";

import * as userModel from "../models/userModel";
import type { UserPayload } from "../types/jwt";

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
            const { id } = decoded as UserPayload;
            const user = await userModel.getUserByUserId(Number(id));
            if (user) {
              req.user = user;
            }
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
