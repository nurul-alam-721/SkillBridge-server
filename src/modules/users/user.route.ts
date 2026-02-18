import express, { Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = express.Router();

router.get("/users", auth(UserRole.ADMIN), userController.getAllUsers);

router.put("/users/:id", auth(UserRole.ADMIN), userController.updateUserStatus);


export const userRoutes: Router = router;
