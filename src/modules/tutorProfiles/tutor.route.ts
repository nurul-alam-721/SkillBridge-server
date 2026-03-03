import express, { Router } from "express";

import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/me/stats", auth(UserRole.TUTOR), tutorController.getTutorStats);
router.get("/me", auth(UserRole.TUTOR), tutorController.getMyProfile);
router.post(
  "/create-profile",
  auth(UserRole.TUTOR),
  tutorController.createTutorProfile,
);
router.put("/me", auth(UserRole.TUTOR), tutorController.updateTutorProfile);
router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getTutorById);

export const tutorRoutes: Router = router;
