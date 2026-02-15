import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

// Create Tutor Profile
const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 
    const profile = await TutorService.createProfile(userId as string, req.body);
    res.status(201).json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Update Tutor Profile
const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const profile = await TutorService.updaeProfile(userId as string, req.body);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get Current Tutor Profile
const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const profile = await TutorService.getProfileByUserId(userId as string);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Tutors
const getAllTutors = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const tutors = await TutorService.getAllTutors(categoryId as string);
    res.status(200).json(tutors);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single Tutor
const getTutorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tutor = await TutorService.getTutorById(id as string);
    res.status(200).json(tutor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const TutorController = {
  createProfile,
  updateProfile,
  getMyProfile,
  getAllTutors,
  getTutorById,
};  
