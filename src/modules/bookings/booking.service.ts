import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middlewares/globalErrorHandler";
import httpStatus from "http-status";

const createBooking = async (
  studentId: string,
  payload: {
    tutorProfileId: string;
    slotId: string;
  }
) => {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      slotId: payload.slotId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
    },
  });

  if (existingBooking) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This slot is already booked"
    );
  }

  return prisma.booking.create({
    data: {
      studentId,
      tutorProfileId: payload.tutorProfileId,
      slotId: payload.slotId,
    },
  });
};


const getMyBookings = async (userId: string, role: "STUDENT" | "TUTOR") => {
  if (role === "STUDENT") {
    return prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        tutorProfile: true,
        slot: true,
      },
    });
  }

  // tutor
  return prisma.booking.findMany({
    where: {
      tutorProfile: {
        userId,
      },
    },
    include: {
      student: true,
      slot: true,
    },
  });
};

export const updateBookingStatusByTutor = async (
  bookingId: string,
  status: BookingStatus
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  });

  if (!booking) throw new ApiError(404, "Booking not found");

  const currentStatus = booking.status;

  const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    COMPLETED: [], 
    CANCELLED: [], 
  };

  if (!allowedTransitions[currentStatus].includes(status)) {
    throw new ApiError(
      403,
      `Cannot change booking from ${currentStatus} to ${status}`
    );
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return updated;
};

export const autoCompleteBookings = async () => {
  const now = new Date();

  const bookingsToComplete = await prisma.booking.findMany({
    where: {
      status: BookingStatus.CONFIRMED,
      slot: { endTime: { lt: now } },
    },
    include: { slot: true },
  });

  const completedBookings = [];

  for (const booking of bookingsToComplete) {
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.COMPLETED },
    });
    completedBookings.push(updated);
  }

  return completedBookings;
};



const getBookingById = async (id: string) => {
  return prisma.booking.findUniqueOrThrow({
    where: { id },
    include: {
      student: true,
      tutorProfile: true,
      slot: true,
    },
  });
};

export const BookingService = {
  createBooking,
  getMyBookings,
  updateBookingStatusByTutor,
  getBookingById,
};
