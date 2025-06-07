import express from "express";
import {
	login,
	register,
	logout,
	adminLogin,
} from "../controllers/user.controller.js";
import { loginValidation, registerValidation } from "../validation/user.js";

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);
router.post("/logout", logout);
router.post("/admin", loginValidation, adminLogin);

export default router;
