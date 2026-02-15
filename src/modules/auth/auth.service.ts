import { prisma } from "../../lib/prisma";

const getCurrentUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId }
  });
};

export const authService = {
  getCurrentUser,
};
