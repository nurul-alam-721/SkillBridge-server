import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tutors: true } } },
  });
};

 const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { tutors: true } } },
  });
};
 


const createCategory = async (name: string, description?: string) => {
  return prisma.category.create({
    data: { name: name.trim(), description: description?.trim() || null },
    include: { _count: { select: { tutors: true } } },
  });
};

const updateCategory = async (id: string, name: string, description?: string) => {
  return prisma.category.update({
    where: { id },
    data: { name: name.trim(), description: description?.trim() || null },
    include: { _count: { select: { tutors: true } } },
  });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

export const CategoryService = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };