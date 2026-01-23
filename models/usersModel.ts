import { prisma } from "../lib/prisma";

const getUserBySpotifyId = async (spotifyId: string) => {
  const user = await prisma.users.findUnique({
    where: {
      spotifyId: spotifyId,
    },
  });
  return user;
};

export { getUserBySpotifyId };
