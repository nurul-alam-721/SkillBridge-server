
import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getCategoryById);

router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

router.put("/:id", auth(UserRole.ADMIN), CategoryController.updateCategory);

router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const categoryRoutes: Router = router;





