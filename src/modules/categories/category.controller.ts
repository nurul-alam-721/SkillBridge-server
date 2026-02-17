import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
       res.status(200).json({
      success: true,
      message: "Categories fetched successfully!",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.createCategory(name, description);
     res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await categoryService.updateCategory(id as string, name, description);
     res.status(201).json({
      success: true,
      message: "Category updated successfully!",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id as string);
    res.status(204).json({
      success: true,
      message: "Category deleted successfully!",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id as string);
    res.status(201).json({
      success: true,
      message: "Category fetched successfully!",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const CategoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};