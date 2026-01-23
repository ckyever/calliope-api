import { prisma } from "../lib/prisma";

const getUserByUserId = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

const getUserBySpotifyId = async (spotifyId: string) => {
  const user = await prisma.users.findUnique({
    where: {
      spotifyId: spotifyId,
    },
  });
  return user;
};

export { getUserByUserId, getUserBySpotifyId };
