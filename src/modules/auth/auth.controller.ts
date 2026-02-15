import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw { status: 401, message: "Unauthorized" };
    }

    const user = await authService.getCurrentUser(req.user.id);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


export const authController = {
  getCurrentUser
}