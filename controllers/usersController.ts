import type { Request, Response } from "express";

import * as userModel from "../models/userModel";

const getCurrentUser = async (req: Request, res: Response) => {
  return res.json({ user: req.user });
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await userModel.getAllUsers();
  return res.json({ users: users });
};

export { getCurrentUser, getAllUsers };
