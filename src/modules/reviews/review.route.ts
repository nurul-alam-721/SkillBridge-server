import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router:Router = Router();

router.get("/:tutorProfileId", ReviewController.getReviewsByTutor);

router.post("/", auth(UserRole.STUDENT), ReviewController.createReview);

router.put("/:id", auth(UserRole.STUDENT), ReviewController.updateReview);

router.delete("/:id", auth(UserRole.STUDENT, UserRole.ADMIN), ReviewController.deleteReview);

export const reviewRoutes = router;
