import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service";
import httpStatus from "http-status";
import { UserRole } from "../../middlewares/auth";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id as string;
    const { tutorProfileId, rating, comment } = req.body;

    const review = await ReviewService.createReview(studentId, tutorProfileId, {
      rating,
      comment,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.id as string;
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const updated = await ReviewService.updateReview(reviewId as string, studentId, {
      rating,
      comment,
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Review updated successfully!",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const userRole = req.user?.role as UserRole.STUDENT | UserRole.ADMIN;
    const reviewId = req.params.id;

    await ReviewService.deleteReview(reviewId as string, userId, userRole);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Review deleted successfully!",
      data: null
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsByTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tutorId } = req.params;
    const reviews = await ReviewService.getReviewsByTutor(tutorId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Reviews of the tutor fetched successfully!",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByTutor,
};
