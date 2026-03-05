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

interface UserInfo {
  spotifyId: string | null;
  username: string | null;
  displayName: string | null;
  password: string | null;
}

const createUser = async ({
  spotifyId = null,
  username = null,
  displayName = null,
  password = null,
}: UserInfo) => {
  if (!spotifyId && !username) {
    throw Error("User must have either a Spotify ID or Username");
  }

  const user = await prisma.user.create({
    data: {
      spotifyId: spotifyId,
      username: username,
      displayName: displayName,
      password: password,
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

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export {
  getUserByUserId,
  getUserBySpotifyId,
  createUser,
  updateUser,
  getAllUsers,
};
