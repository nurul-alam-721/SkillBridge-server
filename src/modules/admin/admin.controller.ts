import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getStats();
    res.status(httpStatus.OK).json({
      success: true,
      message: "Admin stats fetched successfully!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await AdminService.getAllBookings();
    res.status(httpStatus.OK).json({
      success: true,
      message: "All bookings fetched successfully!",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = { getStats, getAllBookings };