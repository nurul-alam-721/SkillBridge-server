import express, { Router } from "express";

import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/", tutorController.getAllTutors);
router.get("/me/stats", auth(UserRole.TUTOR), tutorController.getTutorStats);
router.get("/:id", tutorController.getTutorById);

router.post(
  "/create-profile",
  auth(UserRole.TUTOR),
  tutorController.createTutorProfile,
);
router.put("/me", auth(UserRole.TUTOR, UserRole.ADMIN), tutorController.updateTutorProfile);

export const tutorRoutes: Router = router;
