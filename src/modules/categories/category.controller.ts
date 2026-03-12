import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res
      .status(httpStatus.OK)
      .json({ success: true, message: "All categories fetched successfully!", data: categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id as string);
    if (!category) {
      res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Category not found" });
      return;
    }
    res.status(httpStatus.OK).json({ success: true, message: "Category fetched", data: category });
  } catch (error) { next(error); }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;
    const category = await CategoryService.createCategory(name, description);
    res
      .status(httpStatus.CREATED)
      .json({ success: true, message: "Category created successfully!", data: category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await CategoryService.updateCategory(
      id as string,
      name,
      description,
    );
    res
      .status(httpStatus.OK)
      .json({ success: true, message: "Category updated successfully!", data: category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await CategoryService.deleteCategory(req.params.id as string);
    res
      .status(httpStatus.OK)
      .json({ success: true, message: "Category deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
