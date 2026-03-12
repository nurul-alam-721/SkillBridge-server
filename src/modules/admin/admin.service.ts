import { prisma } from "../../lib/prisma";

export type UserStatus = "ACTIVE" | "BANNED";

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalStudents,
      totalTutors,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCategories,
      recentBookings,
      revenueAgg,
    ] = await Promise.all([
      tx.user.count({ where: { role: "STUDENT" } }),
      tx.user.count({ where: { role: "TUTOR" } }),
      tx.booking.count(),
      tx.booking.count({ where: { status: "PENDING" } }),
      tx.booking.count({ where: { status: "CONFIRMED" } }),
      tx.booking.count({ where: { status: "COMPLETED" } }),
      tx.booking.count({ where: { status: "CANCELLED" } }),
      tx.category.count(),
      tx.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          student: { select: { name: true, image: true } },
          tutorProfile: {
            include: {
              user: { select: { name: true } },
              category: { select: { name: true } },
            },
          },
          slot: { select: { startTime: true, endTime: true } },
        },
      }),
      tx.booking.findMany({
        where: { status: "COMPLETED" },
        include: {
          tutorProfile: { select: { hourlyRate: true } },
          slot: { select: { startTime: true, endTime: true } },
        },
      }),
    ]);

    const totalRevenue = revenueAgg.reduce((sum, booking) => {
      const start = new Date(booking.slot.startTime).getTime();
      const end   = new Date(booking.slot.endTime).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return sum + booking.tutorProfile.hourlyRate * hours;
    }, 0);

    return {
      totalStudents,
      totalTutors,
      totalUsers: totalStudents + totalTutors,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCategories,
      totalRevenue: Math.round(totalRevenue),
      recentActivity: recentBookings,
    };
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { id: true, name: true, email: true, image: true } },
      tutorProfile: {
        include: {
          user: { select: { name: true, email: true } },
          category: { select: { name: true } },
        },
      },
      slot: { select: { startTime: true, endTime: true } },
    },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  return prisma.user.update({
    where: { id },
    data: { status },
  });
};

export const AdminService = { getStats, getAllBookings, getAllUsers, updateUserStatus };