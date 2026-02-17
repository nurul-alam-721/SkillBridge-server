import express, { Router } from "express";
import { AvailabilityController } from "./availability.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.post(
  "/tutor/availability",
  auth(UserRole.TUTOR),
  AvailabilityController.createAvailabilitySlot
);

router.get(
  "/tutor/availability",
  auth(UserRole.TUTOR),
  AvailabilityController.getTutorSlots
);

router.delete(
  "/tutor/availability/:slotId",
  auth(UserRole.TUTOR),
  AvailabilityController.deleteSlot
);

router.get(
  "/availability/tutor/:tutorProfileId",
  AvailabilityController.getPublicSlotsByTutor
);

router.get(
  "/tutor/availability/:tutorProfileId/grouped",
  AvailabilityController.getSlotsByTutorGroupedByDate
);

export const AvailabilityRoutes = router;