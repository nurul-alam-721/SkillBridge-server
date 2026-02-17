import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
import { notFound } from "./middlewares/notFound";
import { tutorRoutes } from "./modules/tutor/tutor.route";
import { adminRoutes } from "./modules/admin/admin.route";
import errorHandler from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/categories/category.route";
import { AvailabilityRoutes } from "./modules/availabilitySlot/availability.route";
import { bookingRoutes } from "./modules/bookings/booking.route";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))

app.use(express.json());

app.use("/api/admin", adminRoutes)

app.use("/api/auth", authRoutes)

app.use("/api/categories", categoryRoutes)

app.use("/api/tutors", tutorRoutes)

app.use("/api", AvailabilityRoutes);

app.use("/api/bookings", bookingRoutes);

    
app.get("/", (req, res) => {
    res.send("Hello from SkillBridge!");
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(notFound);

app.use(errorHandler);

export default app;