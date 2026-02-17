import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: users
    });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await AdminService.updateUserStatus(id as string, status);
   res.status(201).json({
      success: true,
      message: "User status updated successfully!",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await AdminService.getAllBookings();
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully!",
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};


export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
};
