import express, { Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);

router.patch("/:id", auth(UserRole.ADMIN), userController.updateUserStatus);


export const userRoutes: Router = router;
