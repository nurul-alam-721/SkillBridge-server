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

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: true,
      tutorProfile: { include: { user: true } },
      slot: true,
    },
  });
};

export const updateBookingStatusByTutor = async (
  bookingId: string,
  tutorProfileId: string,
  status: BookingStatus
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true, tutorProfile: true },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.tutorProfileId !== tutorProfileId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not allowed to update this booking");
  }

  const now = new Date();
  const currentStatus = booking.status;

  if (
    currentStatus === BookingStatus.COMPLETED ||
    currentStatus === BookingStatus.CANCELLED
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Booking status can no longer be changed");
  }

  if (
    status === BookingStatus.CANCELLED &&
    booking.slot.endTime <= now
  ) {
    throw new ApiError(
      400,
      "Cannot cancel a booking after the session has ended"
    );
  }

  const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[currentStatus].includes(status)) {
    throw new ApiError(
      403,
      `Invalid status transition from ${currentStatus} to ${status}`
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};


export const autoCompleteBookings = async () => {
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      status: BookingStatus.CONFIRMED,
      slot: {
        endTime: { lt: now },
      },
    },
  });

  const updates = bookings.map((booking) =>
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.COMPLETED },
    })
  );

  return Promise.all(updates);
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
  getAllBookings,
  getMyBookings,
  updateBookingStatusByTutor,
  getBookingById,
};
