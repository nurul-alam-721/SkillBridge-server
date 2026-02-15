import express, { Router } from "express";

import { TutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/", TutorController.getAllTutors);
router.get("/:id", TutorController.getTutorById);

router.post("/me", auth(UserRole.TUTOR), TutorController.createProfile);
router.patch("/me", auth(UserRole.TUTOR), TutorController.updateProfile);

export const tutorRoutes: Router = router;
