import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
import { notFound } from "./middlewares/notFound";
import { tutorRoutes } from "./modules/tutor/tutor.router";
import { adminRoutes } from "./modules/admin/admin.router";
import { errorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/tutors", tutorRoutes)

app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
    res.send("Hello from SkillBridge!");
});

app.use(notFound);

app.use(errorHandler);

export default app;