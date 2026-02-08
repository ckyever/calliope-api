import type { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  id: Number;
  spotifyId: Number;
  displayName: String;
}

export type { UserPayload };
