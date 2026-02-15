import { prisma } from "../../lib/prisma";

interface TutorProfileData {
  bio: string;
  hourlyRate: number;
  experience: number;
  categoryId: string;
}

// Create Tutor Profile
const createProfile = async (userId: string, data: TutorProfileData) => {
  const existing = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (existing) throw new Error("Profile already exists");

  return prisma.tutorProfile.create({
    data: {
      userId,
      bio: data.bio,
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

// Update Tutor Profile
const updateProfile = async (userId: string, data: Partial<TutorProfileData>) => {
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



// Get all tutors with optional category filter
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


// Get single tutor by tutorProfileId
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
