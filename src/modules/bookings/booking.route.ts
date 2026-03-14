import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { BookingController } from "./booking.controller";

const router: Router = express.Router();

router.post(
  "/",
  auth(UserRole.STUDENT),
  BookingController.createBooking
);


router.get(
  "/me",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getMyBookings
);

router.put(
  "/:id/status",
  auth(UserRole.TUTOR),
  BookingController.updateBookingStatusByTutor
);

router.get(
  "/:id",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getBookingById
);


export const bookingRoutes = router;
