import "dotenv/config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {

    const adminData = {
      name: "Amin Ahmed",
      email: "amin@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      return;
    }


    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (!signUpAdmin.ok) {
      const errorText = await signUpAdmin.text();
      throw new Error(`Sign up failed: ${signUpAdmin.status} - ${errorText}`);
    }

    const responseData = await signUpAdmin.json();

    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true },
    });

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
