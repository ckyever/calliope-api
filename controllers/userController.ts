import type { Request, Response } from "express";

const getUser = async (req: Request, res: Response) => {
  return res.json({ user: req.user });
};

export { getUser };
