import { NextFunction, Request, Response } from "express";
import { BookingStatus } from "@prisma/client";
import { BookingService } from "./booking.service";

// Student creates booking
const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user?.id!;
    const booking = await BookingService.createBooking(studentId, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Student or Tutor: get own bookings
const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id!;
    const role = req.user?.role!;

    const bookings = await BookingService.getMyBookings(
      userId,
      role === "STUDENT" ? "STUDENT" : "TUTOR",
    );

    res.status(200).json({
      success: true,
      message: "My bookings fetched successfully!",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Tutor updates booking status
const updateBookingStatusByTutor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await BookingService.updateBookingStatusByTutor(
      id as string,
      status as BookingStatus,
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully!",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get single booking
const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await BookingService.getBookingById(
      req.params.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully!",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const BookingController = {
  createBooking,
  getMyBookings,
  updateBookingStatusByTutor,
  getBookingById,
};
