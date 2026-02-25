import { Prisma, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";
import { ApiError } from "../../middlewares/globalErrorHandler";

export interface TutorProfileData {
  bio?: string;        
  hourlyRate: number;
  experience: number;
  categoryId: string;
}
export type TutorSortableFields = "createdAt" | "hourlyRate" | "rating" | "experience";

export type GetAllTutorsParams = {
  search?: string;
  categoryId?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  minExperience?: number;
  availableDate?: string;
  page: number;
  limit: number;
  skip: number;
  sortBy: TutorSortableFields;
  sortOrder: "asc" | "desc";
};


const createTutorProfile = async (userId: string, data: TutorProfileData) => {
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

const updateTutorProfile = async (userId: string, data: Partial<TutorProfileData>) => {
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

const getAllTutors = async (params: GetAllTutorsParams) => {
    if (!params.limit || params.limit <= 0) {
      throw new ApiError(400, "Limit must be a positive integer");
    }

    const {
      search,
      categoryId,
      minRate,
      maxRate,
      minRating,
      minExperience,
      availableDate,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    } = params;

    const andConditions: Prisma.TutorProfileWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          { user: { name: { contains: search, mode: "insensitive" } } },
          { category: { name: { contains: search, mode: "insensitive" } } },
          { bio: { contains: search, mode: "insensitive" } }
        ],
      });
    }

    if (categoryId) andConditions.push({ categoryId });

    if (minRate !== undefined || maxRate !== undefined) {
      andConditions.push({
        hourlyRate: {
          ...(minRate !== undefined && { gte: minRate }),
          ...(maxRate !== undefined && { lte: maxRate }),
        },
      });
    }

    // Rating filter
    if (minRating !== undefined) {
      andConditions.push({ rating: { gte: minRating } });
    }

    // Experience filter
    if (minExperience !== undefined) {
      andConditions.push({ experience: { gte: minExperience } });
    }

    // Availability filter
    if (availableDate) {
      andConditions.push({
        availability: {
          some: {
            date: new Date(availableDate),
            isBooked: false,
          },
        },
      });
    }

    const whereCondition: Prisma.TutorProfileWhereInput = {
      ...(andConditions.length > 0 && { AND: andConditions }),
      user: {
        role: UserRole.TUTOR,
        status: UserStatus.ACTIVE,
      },
    };

    const [tutors, totalTutors] = await Promise.all([
      prisma.tutorProfile.findMany({
        take: limit,
        skip,
        where: whereCondition,
        include: {
          user: true,
          category: true,
          availability: true,
          reviews: true,
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.tutorProfile.count({ where: whereCondition }),
    ]);

    return {
      tutors,
      pagination: {
        totalTutors,
        page,
        limit,
        totalPages: Math.ceil(totalTutors / limit),
      },
    };
  }


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

export const tutorService = {
  createTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
};
