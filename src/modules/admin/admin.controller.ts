import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getStats();
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        message: "Admin stats fetched successfully",
        data: stats,
      });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookings = await AdminService.getAllBookings();
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        message: "All bookings fetched successfully",
        data: bookings,
      });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsers();
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        message: "All users fetched successfully",
        data: users,
      });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await AdminService.updateUserStatus(id as string, status);
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        message: `User ${status === "BANNED" ? "banned" : "activated"} successfully`,
        data: user,
      });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getStats,
  getAllBookings,
  getAllUsers,
  updateUserStatus,
};
