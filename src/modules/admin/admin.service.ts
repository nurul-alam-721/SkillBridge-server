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

const getAllCategories = async () => {
  return prisma.category.findMany();
};

const createCategory = async (name: string) => {
  return prisma.category.create({ data: { name } });
};

const updateCategory = async (id: string, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
