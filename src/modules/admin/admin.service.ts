import { prisma } from "../../lib/prisma";

export type UserStatus = "ACTIVE" | "BANNED";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  return prisma.user.update({
    where: { id },
    data: { status },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: true,
      tutorProfile: { include: { user: true } },
      slot: true,
    },
  });
};



export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
};
