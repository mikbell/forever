import express from "express";
import {
	login,
	register,
	logout,
	adminLogin,
} from "../controllers/user.controller.js";
import { validateRegistration } from "../validation/user.js";

const router = express.Router();

router.post("/login", validateRegistration, login);
router.post("/register", validateRegistration, register);
router.post("/logout", logout);
router.post("/admin", validateRegistration, adminLogin);

export default router;
