import express, { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.patch("/users/:id", auth(UserRole.ADMIN), AdminController.updateUserStatus);

router.get("/bookings", auth(UserRole.ADMIN), AdminController.getAllBookings);

router.get("/categories", auth(UserRole.ADMIN), AdminController.getAllCategories);
router.post("/categories", auth(UserRole.ADMIN), AdminController.createCategory);
router.put("/categories/:id", auth(UserRole.ADMIN), AdminController.updateCategory);
router.delete("/categories/:id", auth(UserRole.ADMIN), AdminController.deleteCategory);

export const adminRoutes: Router = router;
