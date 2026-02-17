import { prisma } from "../../lib/prisma";

const createCategory = async (name: string, description?: string) => {
  return prisma.category.create({
    data: {
      name,
      description: description || null,
    },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany();
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

const updateCategory = async (
  id: string,
  name: string,
  description?: string,
) => {
  return prisma.category.update({
    where: { id },
    data: {
      name,
      ...(description !== undefined && { description }),
    },
  });
};

const getCategoryById = async (id: string) => {
  return prisma.category.findUniqueOrThrow({
    where: { id }
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};
