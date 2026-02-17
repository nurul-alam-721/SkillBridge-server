import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AvailabilityService } from "./availability.service";

const getTutorProfile = async (userId: string) => {
  return prisma.tutorProfile.findUnique({ where: { userId } });
};

const createAvailabilitySlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const tutorProfile = await getTutorProfile(userId);

    if (!tutorProfile) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const slot = await AvailabilityService.createAvailabilitySlot(
      tutorProfile.id,
      req.body
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Availability slot created successfully",
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

const getTutorSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const tutorProfile = await getTutorProfile(userId);

    if (!tutorProfile) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const slots = await AvailabilityService.getTutorSlots(tutorProfile.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Your availability slots fetched successfully",
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const { slotId } = req.params;
    const tutorProfile = await getTutorProfile(userId);

    if (!tutorProfile) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    await AvailabilityService.deleteSlot(slotId as string, tutorProfile.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Availability slot deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicSlotsByTutor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tutorProfileId } = req.params;
    const date = req.query.date as string | undefined;

    const slots = await AvailabilityService.getPublicSlotsByTutor(
      tutorProfileId as string,
      date
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Available slots of the tutor fetched successfully",
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

const getSlotsByTutorGroupedByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tutorProfileId } = req.params;

    const slots = await AvailabilityService.getSlotsByTutorGroupedByDate(
      tutorProfileId as string
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Slots fetched and grouped by date successfully",
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

export const AvailabilityController = {
  createAvailabilitySlot,
  getTutorSlots,
  deleteSlot,
  getPublicSlotsByTutor,
  getSlotsByTutorGroupedByDate,
};