import express, { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.put("/users/:id", auth(UserRole.ADMIN), AdminController.updateUserStatus);

router.get("/bookings", auth(UserRole.ADMIN), AdminController.getAllBookings);

export const adminRoutes: Router = router;
