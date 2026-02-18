import express, { Router } from "express";

import { TutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/", TutorController.getAllTutors);
router.get("/:id", TutorController.getTutorById);

router.post("/create-profile", auth(UserRole.TUTOR), TutorController.createTutorProfile);
router.put("/me", auth(UserRole.TUTOR), TutorController.updateTutorProfile);

export const tutorRoutes: Router = router;
