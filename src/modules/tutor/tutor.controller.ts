import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

// Create Tutor Profile
const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const profile = await TutorService.createProfile(userId as string, req.body);
   res.status(200).json({
      success: true,
      message: "Tutor profile created successfully!",
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Update Tutor Profile
const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const profile = await TutorService.updateProfile(userId as string, req.body);
     res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully!",
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Get All Tutors
const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.query;
    const tutors = await TutorService.getAllTutors(categoryId as string);
    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully!",
      data: tutors,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Tutor
const getTutorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const tutor = await TutorService.getTutorById(id as string);
    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully!",
      data: tutor,
    });
  } catch (error) {
    next(error);
  }
};

export const TutorController = {
  createProfile,
  updateProfile,
  getAllTutors,
  getTutorById,
};
