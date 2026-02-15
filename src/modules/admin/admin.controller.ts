import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await AdminService.updateUserStatus(id as string, status);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await AdminService.getAllBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await AdminService.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const category = await AdminService.createCategory(name);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await AdminService.updateCategory(id as string, name);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await AdminService.deleteCategory(id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
