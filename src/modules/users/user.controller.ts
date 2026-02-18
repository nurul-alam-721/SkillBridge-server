import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Alll Users fetched successfully!",
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
    const user = await userService.updateUserStatus(id as string, status);
   res.status(201).json({
      success: true,
      message: "User status updated successfully!",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const userController = {
  getAllUsers,
  updateUserStatus
};
