import express, { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/admin/stats", auth(UserRole.ADMIN), AdminController.getStats);

router.get(
  "/admin/bookings",
  auth(UserRole.ADMIN),
  AdminController.getAllBookings,
);

export const AdminRoutes = router;
