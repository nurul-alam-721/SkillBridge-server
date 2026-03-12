import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};



type UpdateOwnProfilePayload = {
  name?: string;
  phone?: string;
  image?: string;
};

const updateOwnProfile = async (
  userId: string,
  payload: UpdateOwnProfilePayload
) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });
};



export const userService = {
  getAllUsers,
  updateOwnProfile
};
