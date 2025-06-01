import express from "express";
import * as userController from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/admin", userController.adminLogin);
userRouter.post("/logout", userController.logout);

export default userRouter;