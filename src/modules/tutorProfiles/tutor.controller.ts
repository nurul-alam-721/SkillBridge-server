import { NextFunction, Request, Response } from "express";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { GetAllTutorsParams, tutorService } from "./tutor.service";


// Create Tutor Profile
const createTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const profile = await tutorService.createTutorProfile(
      userId as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Tutor profile created successfully!",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Update Tutor Profile
const updateTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const profile = await tutorService.updateTutorProfile(
      userId as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully!",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTutors = async (req: Request, res: Response) => {
  try {
    // Parse query parameters safely
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const minRate = typeof req.query.minRate === "string" ? Number(req.query.minRate) : undefined;
    const maxRate = typeof req.query.maxRate === "string" ? Number(req.query.maxRate) : undefined;
    const minRating = typeof req.query.minRating === "string" ? Number(req.query.minRating) : undefined;
    const minExperience = typeof req.query.minExperience === "string" ? Number(req.query.minExperience) : undefined;
    const availableDate = typeof req.query.availableDate === "string" ? req.query.availableDate : undefined;

    // Pagination & Sorting
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query as Record<string, unknown>
    );

    // Build params object
    const params: GetAllTutorsParams = {
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
    };

    // Call service
    const result = await tutorService.getAllTutors(params);

    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully!",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Getting tutors failed",
      error,
    });
  }
};





// Get Single Tutor
const getTutorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const tutor = await tutorService.getTutorById(id as string);
    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully!",
      data: tutor,
    });
  } catch (error) {
    next(error);
  }
};

export const tutorController = {
  createTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
};
