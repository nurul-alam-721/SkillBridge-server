import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middlewares/globalErrorHandler";

export interface TutorProfileData {
  bio?: string;        
  hourlyRate: number;
  experience: number;
  categoryId: string;
}

const createProfile = async (userId: string, data: TutorProfileData) => {
  if (!userId) throw new Error("User not logged in");

  const existing = await prisma.tutorProfile.findUnique({ where: { userId } });
if (existing) throw new ApiError(400, "Profile already exists");

  return prisma.tutorProfile.create({
    data: {
      userId,
      bio: data.bio || "No bio provided",
      hourlyRate: data.hourlyRate,
      experience: data.experience,
      categoryId: data.categoryId,
    },
    include: {
      user: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

const updateProfile = async (userId: string, data: Partial<TutorProfileData>) => {
  if (!userId) throw new Error("User not logged in");

  const updateData: any = {};
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate;
  if (data.experience !== undefined) updateData.experience = data.experience;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

  return prisma.tutorProfile.update({
    where: { userId },
    data: updateData,
    include: {
      user: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

const getAllTutors = async (categoryId?: string) => {
  const where = categoryId ? { categoryId } : {};
  return prisma.tutorProfile.findMany({
    where,
    include: {
      user: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

const getTutorById = async (tutorId: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

export const TutorService = {
  createProfile,
  updateProfile,
  getAllTutors,
  getTutorById,
};
