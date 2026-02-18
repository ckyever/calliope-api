import { prisma } from "../lib/prisma";

const getUserByUserId = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

const getUserBySpotifyId = async (spotifyId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      spotifyId: spotifyId,
    },
  });
  return user;
};

const createUser = async (spotifyId: string, displayName: string) => {
  const user = await prisma.user.create({
    data: {
      spotifyId: spotifyId,
      displayName: displayName,
    },
  });
  return user;
};

const updateUser = async (spotifyId: string, displayName: string) => {
  const user = await prisma.user.update({
    where: {
      spotifyId: spotifyId,
    },
    data: {
      displayName: displayName,
    },
  });
  return user;
};

export { getUserByUserId, getUserBySpotifyId, createUser, updateUser };
